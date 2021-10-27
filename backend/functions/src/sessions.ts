import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sessionUtil from './util/session';
import { SESS_STATUS_STARTED, SUCCESS_RESP } from './consts/values';
import { validateAndGetUid } from './util/auth';
import { CallableContext } from 'firebase-functions/v1/https';
import { sendMessage } from './util/message';
import { validateAndGetQueueName } from './util/queue';
import {
  CHANGE_QUESTION_REQUEST,
  FOUND_SESSION,
  WRITE_DEFAULT_CODE,
} from './consts/msgTypes';
import { getRandomQuestion } from './util/question';

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

      const foundSessionData = { sessId, qnsId };
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

export const changeQuestionRequest = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const currUid = validateAndGetUid(context);
    const sessId = await sessionUtil.getCurrentSessionId(currUid);
    if (!sessId) {
      throw new functions.https.HttpsError('not-found', 'Session not found.');
    }

    const session = await sessionUtil.getSession(sessId);
    functions.logger.info('Current session: ', session);
    for (const uid of session.users) {
      if (uid != currUid) {
        sendMessage(uid, CHANGE_QUESTION_REQUEST, null);
      }
    }
  }
);

export const changeQuestion = functions.https.onCall(
  async (data: App.changeQuestionRequest, context: CallableContext) => {
    const queueName = validateAndGetQueueName(data);
    const uid = validateAndGetUid(context);
    const sessionPath = admin.database().ref('/sessions');
    const sessId = await sessionUtil.getCurrentSessionId(uid);
    if (!sessId) {
      throw new functions.https.HttpsError('not-found', 'Session not found.');
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
