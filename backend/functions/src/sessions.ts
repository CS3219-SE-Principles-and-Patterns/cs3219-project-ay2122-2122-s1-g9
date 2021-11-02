import * as functions from 'firebase-functions';
import * as sessionCore from './core/sessionCore';
import { validateAndGetUid } from './core/authCore';
import { CallableContext } from 'firebase-functions/v1/https';
import { SUCCESS_RESP } from './consts/values';

export const stopSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionCore.getCurrentSessionId(uid);

    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }

    await sessionCore.endSession(sessId);
    return SUCCESS_RESP;
  }
);

export const getCurrentSessionId = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionCore.getCurrentSessionId(uid);
    return { sessId };
  }
);

export const isInCurrentSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const res = await sessionCore.isInCurrentSession(uid);
    return { isInCurrentSession: res };
  }
);

export const getSession = functions.https.onCall(
  async (data: App.getSessionData, context: CallableContext) => {
    validateAndGetUid(context); // Only logged in users can get session data

    if (!data || !data.sessId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a single argument "sessId"'
      );
    }

    const sessId = data.sessId;
    return sessionCore.getSession(sessId);
  }
);

export const changeQuestionRequest = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const currUid = validateAndGetUid(context);
    await sessionCore.processChangeQuestionRequest(currUid);
    return SUCCESS_RESP;
  }
);

export const changeQuestion = functions.https.onCall(
  async (_, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionCore.getCurrentSessionId(uid);
    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }

    await sessionCore.changeQuestionInSession(sessId);
    return SUCCESS_RESP;
  }
);

export const rejectChangeQuestion = functions.https.onCall(
  async (_, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    await sessionCore.rejectChangeQuestion(uid);
    return SUCCESS_RESP;
  }
);
