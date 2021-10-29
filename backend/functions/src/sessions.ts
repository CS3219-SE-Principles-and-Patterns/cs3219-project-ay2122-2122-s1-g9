import * as functions from 'firebase-functions';
import * as sessionUtil from './core/sessionCore';
import { validateAndGetUid } from './core/authCore';
import { CallableContext } from 'firebase-functions/v1/https';

export const stopSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionUtil.getCurrentSessionId(uid);

    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }

    await sessionUtil.endSession(sessId);
    return SUCCESS_RESP;
  }
);

export const getCurrentSessionId = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionUtil.getCurrentSessionId(uid);
    return { sessId };
  }
);

export const isInCurrentSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const res = await sessionUtil.isInCurrentSession(uid);
    return { isInCurrentSession: res };
  }
);

export const changeQuestionRequest = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const currUid = validateAndGetUid(context);
    const sessId = await sessionUtil.getCurrentSessionId(currUid);
    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }
    const partnerId = await sessionUtil.findSessionPartner(currUid, sessId);
    await sendMessage(partnerId, CHANGE_QUESTION_REQUEST, null);
  }
);

export const changeQuestion = functions.https.onCall(
  async (data: App.changeQuestionData, context: CallableContext) => {
    const queueName = validateAndGetQueueName(data);
    const uid = validateAndGetUid(context);
    const sessionPath = admin.database().ref('/sessions');
    const sessId = await sessionUtil.getCurrentSessionId(uid);
    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }
    const currentSession = await sessionUtil.getSession(sessId);
    functions.logger.info('Current session: ', currentSession);
    const users = currentSession.users;

    const qnsId = await getRandomQuestion(queueName);

    const session = {
      users,
      qnsId,
      startedAt: Date.now(),
    };

    sessionPath.push(session);
  }
);
