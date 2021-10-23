import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sessionUtil from './util/session';
import { SESS_STATUS_STARTED, SUCCESS_RESP } from './consts/values';
import { validateAndGetUid } from './util/auth';
import { CallableContext } from 'firebase-functions/v1/https';
import { sendMessage } from './util/message';
import { FOUND_SESSION, WRITE_DEFAULT_CODE } from './consts/msgTypes';

export const initSession = functions.database
  .ref('/sessions/{sessId}')
  .onCreate(
    async (
      snapshot: functions.database.DataSnapshot,
      _context: functions.EventContext
    ) => {
      const fs = admin.firestore();

      const sessFromDb = snapshot.val();
      const sessId = snapshot.key;
      const users: string[] = sessFromDb['users'];
      const qnsId: string = sessFromDb['qnsId'];

      if (users.length != 2) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `There should only be 2 users in a session. Found ${users.length} at session ${sessId}.`
        );
      }

      // Initialize session in firestore
      await fs.collection('sessions').doc(sessId).set({
        users,
        qnsId,
        startedAt: sessFromDb['startedAt'],
        status: SESS_STATUS_STARTED,
      });

      const foundSessionData = { sessId };
      for (const user of users) {
        await sendMessage(user, FOUND_SESSION, foundSessionData);
        await fs.collection('currentSessions').doc(user).set({
          sessId: sessId,
        });
      }

      // Write Default Code
      const writeDefaultCodeData = { sessId, qnsId };
      await sendMessage(users[0], WRITE_DEFAULT_CODE, writeDefaultCodeData);
    }
  );

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
