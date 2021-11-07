import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/v1/https';
import { validateAndGetUid } from './core/authCore';
import { isInCurrentSession } from './core/sessionCore';
import { sendMessage } from './core/msgCore';
import { NO_MATCH_FOUND } from './consts/msgTypes';
import * as queueCore from './core/queueCore';
import { FUNCTION_LOCATION, SUCCESS_RESP } from './consts/values';

export const addUserToQueue = functions
  .region(FUNCTION_LOCATION)
  .https.onCall(async (data: App.addUserToQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = queueCore.validateAndGetLevel(data);

    await queueCore.addUserToQueue(uid, queueName);
    return SUCCESS_RESP;
  });

export const removeUserFromQueue = functions
  .region(FUNCTION_LOCATION)
  .https.onCall(
    async (data: App.removeUserFromQueue, context: CallableContext) => {
      const uid = validateAndGetUid(context);
      const queueName = queueCore.validateAndGetLevel(data);

      await queueCore.removeUserFromQueue(uid, queueName);
      return SUCCESS_RESP;
    }
  );

// This function will be called by Cloud Tasks so we use onRequest.
export const removeUnmatchedUserAfterTimeout = functions
  .region(FUNCTION_LOCATION)
  .https.onRequest(async (req: functions.Request, res: functions.Response) => {
    functions.logger.info(`Received parameters ${JSON.stringify(req.body)}`);

    const data = req.body.data;

    if (!data || !data.userId || !data.queueName) {
      res.status(400).json({
        code: 'invalid-argument',
        message:
          'The function must be called with two arguments queueName and userId.',
      });
      return;
    }

    // If user is in a session, do nothing
    const userId = data.userId;
    const isUserInSession = await isInCurrentSession(userId);
    if (isUserInSession) {
      const msg = `User ${userId} is already in a session and will not be removed from the queue`;
      functions.logger.info(msg);
      res.status(200).json({
        message: msg,
      });
    }

    // If the user is not in a session, remove them from the queue
    const queueName = queueCore.validateAndGetLevel(data);
    if ((await queueCore.getQueueUserIsIn(userId)) !== queueName) {
      functions.logger.info('C');
      res.status(400).json({
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
  });

export const getQueueUserIsIn = functions
  .region(FUNCTION_LOCATION)
  .https.onCall(async (_data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = await queueCore.getQueueUserIsIn(uid);
    return { queueName };
  });
