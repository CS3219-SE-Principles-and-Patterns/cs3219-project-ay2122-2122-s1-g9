import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import { removeUserFromQueue as _removeUserFromQueue } from './util/queue';

import {
  ALL_LVLS,
  LVL_EASY,
  LVL_HARD,
  LVL_MEDIUM,
  SUCCESS_RESP,
} from './consts/values';
import { validateAndGetUid } from './util/auth';
import { isInCurrentSession } from './util/session';
import { addUserToTimeoutQueue } from './util/task-queue';
import { sendMessage } from './util/message';
import { NO_MATCH_FOUND } from './consts/msgTypes';

function validateAndGetQueueName(data: any): string {
  if (!data || !data.queueName || data.queueName.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a single argument "queueName"'
    );
  }

  if (!ALL_LVLS.includes(data.queueName.toLowerCase())) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `The queueName must be one of ${LVL_EASY}, ${LVL_MEDIUM}, ${LVL_HARD}`
    );
  }

  return data.queueName;
}

export const addUserToQueue = functions.https.onCall(
  async (data: App.addUserToQueue, _: CallableContext) => {
    // const uid = validateAndGetUid(context);
    const uid = '15';
    const queueName = validateAndGetQueueName(data);

    const userIsInCurrentSession = await isInCurrentSession(uid);
    if (userIsInCurrentSession) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'User is already in an active session'
      );
    }

    const queuePath = admin
      .database()
      .ref(`/queues/${queueName.toLowerCase()}`);

    await queuePath.once('value', (snapshot) => {
      let queue = snapshot.val();
      // If the queue does not exist (i.e its currently empty)
      if (queue == null) {
        queue = [];
      }
      queue.push(uid);
      queuePath.set(queue);
    });

    await addUserToTimeoutQueue({
      userId: uid,
      queueName: queueName,
    });

    return SUCCESS_RESP;
  }
);

export const removeUserFromQueue = functions.https.onCall(
  async (data: App.removeUserFromQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);

    await _removeUserFromQueue(uid, queueName);

    return SUCCESS_RESP;
  }
);

export const removeUnmatchedUserAfterTimeout = functions.https.onCall(
  async (data: App.userTimeoutDetails, _: CallableContext) => {
    // If user is not in a session, remove them from the queue
    const isUserInSession = await isInCurrentSession(data.userId);

    // This is not an error
    // TODO: Find better way to return expected sucesss = false responses
    if (isUserInSession) {
      return {
        sucess: false,
        message: 'User has already joined a session',
      };
    }
    validateAndGetQueueName(data);
    functions.logger.info('came here');
    await _removeUserFromQueue(data.userId, data.queueName);
    await sendMessage(
      data.userId,
      NO_MATCH_FOUND,
      'Unable to match user with another user'
    );

    return SUCCESS_RESP;
  }
);
