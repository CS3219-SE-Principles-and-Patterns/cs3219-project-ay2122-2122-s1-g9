import * as functions from 'firebase-functions';
import * as sessionUtil from './core/sessionCore';
import { SUCCESS_RESP } from './consts/values';
import { validateAndGetUid } from './core/authCore';
import { CallableContext } from 'firebase-functions/v1/https';

export const stopSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionUtil.getCurrentSessionId(uid);

    if (!sessId) {
      throw new functions.https.HttpsError('not-found', 'Session not found.');
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
