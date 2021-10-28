import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import {
  removeUserFromQueue as _removeUserFromQueue,
  validateAndGetQueueName,
} from './util/queue';

import { SUCCESS_RESP } from './consts/values';
import { validateAndGetUid } from './util/auth';
import { isInCurrentSession } from './util/session';
import { addUserToTimeoutQueue } from './tasks/matchTimeout';
import { sendMessage } from './util/message';
import { NO_MATCH_FOUND } from './consts/msgTypes';

export const addUserToQueue = functions.https.onCall(
  async (data: App.addUserToQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);
    functions.logger.info('Parameters received: ', data);

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
    // If user is in a session, do nothing
    const isUserInSession = await isInCurrentSession(data.userId);
    if (isUserInSession) {
      functions.logger.info(
        `User ${data.userId} is already in a session and will not be removed from the queue`
      );
      return;
    }

    // If the user is not in a session, remove them from the queue
    validateAndGetQueueName(data);
    await _removeUserFromQueue(data.userId, data.queueName);
    await sendMessage(
      data.userId,
      NO_MATCH_FOUND,
      'Unable to match user with another user'
    );

    functions.logger.info(`User ${data.userId} was removed from the queue`);
    return;
  }
);
