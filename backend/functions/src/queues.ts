import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/v1/https';

import {
  ALL_LVLS,
  LVL_EASY,
  LVL_HARD,
  LVL_MEDIUM,
  SUCCESS_RESP,
} from './consts/values';
import { validateAndGetUid } from './core/authCore';
import { isInCurrentSession } from './core/sessionCore';
import { sendMessage } from './core/msgCore';
import { NO_MATCH_FOUND } from './consts/msgTypes';
import * as queueCore from './core/queueCore';

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
  async (data: App.addUserToQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);

    const userIsInCurrentSession = await isInCurrentSession(uid);
    if (userIsInCurrentSession) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'User is already in an active session'
      );
    }

    await queueCore.addUserToQueue(uid, queueName);
    return SUCCESS_RESP;
  }
);

export const removeUserFromQueue = functions.https.onCall(
  async (data: App.removeUserFromQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);

    await queueCore.removeUserFromQueue(uid, queueName);
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
    await queueCore.removeUserFromQueue(data.userId, data.queueName);
    await sendMessage(
      data.userId,
      NO_MATCH_FOUND,
      'Unable to match user with another user'
    );

    functions.logger.info(`User ${data.userId} was removed from the queue`);
    return;
  }
);
