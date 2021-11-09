import * as functions from 'firebase-functions';
import * as queueCore from './core/queueCore';

import { CallableContext } from 'firebase-functions/v1/https';
import { validateAndGetUid } from './core/authCore';
import { isInCurrentSession } from './core/sessionCore';
import { sendMessage } from './core/msgCore';
import { NO_MATCH_FOUND } from './consts/msgTypes';
import { SUCCESS_RESP } from './consts/values';
import functionBuilder from './functionBuilder';

export const addUserToQueue = functionBuilder.https.onCall(
  async (data: App.addUserToQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = queueCore.validateAndGetLevel(data);

    await queueCore.addUserToQueue(uid, queueName);
    return SUCCESS_RESP;
  }
);

export const removeUserFromQueue = functionBuilder.https.onCall(
  async (data: App.removeUserFromQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = queueCore.validateAndGetLevel(data);

    await queueCore.removeUserFromQueue(uid, queueName);
    return SUCCESS_RESP;
  }
);

// This function will be called by Cloud Tasks so we use onRequest.
export const removeUnmatchedUserAfterTimeout = functionBuilder.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {
    // The status should be all 200 or else the task will automatically be retried.
    // We are using the same error format as functions.https.HttpsError to be consistent

    functions.logger.info(`Received parameters ${JSON.stringify(req.body)}`);

    const data = req.body.data;

    if (!data || !data.userId || !data.queueName) {
      res.status(200).json({
        code: 'invalid-argument',
        message:
          'The function must be called with two arguments queueName and userId.',
      });
      return;
    }

    const userId = data.userId;
    const matchTimeoutTask = await queueCore.getMatchTimeoutTask(userId);

    // Make sure that the task is not outdated
    if (
      !matchTimeoutTask ||
      (matchTimeoutTask && matchTimeoutTask.taskId !== data.taskId)
    ) {
      const msg = `Received outdated task for user ${userId}. Aborting`;
      functions.logger.info(msg);
      res.status(200).json({
        code: 'failed-precondition',
        message: msg,
      });
      return;
    }

    // Remove task that is going to be processed
    await queueCore.removeMatchTimeoutTask(userId);

    // If user is in a session, do nothing
    const isUserInSession = await isInCurrentSession(userId);
    if (isUserInSession) {
      const msg = `User ${userId} is already in a session and will not be removed from the queue`;
      functions.logger.info(msg);
      res.status(200).json({
        code: 'failed-precondition',
        message: msg,
      });
      return;
    }

    // If the user is not in a session, remove them from the queue
    const queueName = queueCore.validateAndGetLevel(data);
    if ((await queueCore.getQueueUserIsIn(userId)) !== queueName) {
      res.status(200).json({
        code: 'failed-precondition',
        message: `UserId ${userId} is not in ${queueName} queue`,
      });
      return;
    }

    await queueCore.removeUserFromQueue(userId, queueName);
    await sendMessage(
      userId,
      NO_MATCH_FOUND,
      'Unable to match user with another user'
    );

    functions.logger.info(`User ${userId} was removed from the queue`);
    res.status(200).json(SUCCESS_RESP);
    return;
  }
);

export const getQueueUserIsIn = functionBuilder.https.onCall(
  async (_data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = await queueCore.getQueueUserIsIn(uid);
    return { queueName };
  }
);
