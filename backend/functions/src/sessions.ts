import * as functions from 'firebase-functions';
import * as sessionCore from './core/sessionCore';
import { SUCCESS_RESP } from './consts/values';
import { validateAndGetUid } from './core/authCore';
import { CallableContext } from 'firebase-functions/v1/https';

export const stopSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await sessionCore.getCurrentSessionId(uid);

    if (!sessId) {
      throw new functions.https.HttpsError('not-found', 'Session not found.');
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
