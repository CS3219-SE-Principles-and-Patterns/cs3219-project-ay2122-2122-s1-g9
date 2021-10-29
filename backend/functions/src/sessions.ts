import * as functions from 'firebase-functions';
import * as sessionCore from './core/sessionCore';
import { validateAndGetUid } from './core/authCore';
import { validateAndGetLevel } from './core/queueCore';
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

export const changeQuestionRequest = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const currUid = validateAndGetUid(context);
    await sessionCore.processChangeQuestionRequest(currUid);
    return SUCCESS_RESP;
  }
);

export const changeQuestion = functions.https.onCall(
  async (data: App.changeQuestionData, context: CallableContext) => {
    const lvl = validateAndGetLevel(data, 'level');
    const uid = validateAndGetUid(context);
    const sessId = await sessionCore.getCurrentSessionId(uid);
    if (!sessId) {
      throw new functions.https.HttpsError(
        'not-found',
        'User is currently not in a session.'
      );
    }

    await sessionCore.changeQuestionInSession(lvl, sessId);
    return SUCCESS_RESP;
  }
);
