import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { isOnline } from './presenceCore';
import { SESS_STATUS_ENDED, SESS_STATUS_STARTED } from '../consts/values';
import { sendMessage } from './msgCore';
import { getQuestion, getRandomQuestion } from './questionCore';
import {
  FOUND_SESSION,
  STOP_SESSION,
  WRITE_DEFAULT_CODE,
} from '../consts/msgTypes';

export async function getSession(sessId: string): Promise<any> {
  const fs = admin.firestore();
  const docRef = await fs.collection('sessions').doc(sessId).get();

  if (!docRef.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      'Session cannot be found.'
    );
  }

  return docRef.data();
}

export async function getTimeElapsed(sessId: string): Promise<number> {
  const sess = await getSession(sessId);
  return sess['startedAt'];
}

export async function findSessionPartner(
  uid: string,
  sessId: string
): Promise<string> {
  const sess = await getSession(sessId);
  const users = sess['users'];

  if (users[0] == uid) {
    return users[1];
  }

  return users[0];
}

export async function endSession(sessId: string): Promise<void> {
  const fs = admin.firestore();

  const sessRef = fs.collection('sessions').doc(sessId);
  const sess = await getSession(sessId);

  await sessRef.update({
    status: SESS_STATUS_ENDED,
    endedAt: Date.now(),
  });

  for (const uid of sess.users) {
    const currentSessUserRef = fs.collection('currentSessions').doc(uid);
    await currentSessUserRef.delete();
  }

  const stopSessionData = { sessId };
  for (const uid of sess.users) {
    await sendMessage(uid, STOP_SESSION, stopSessionData);
  }

  // TODO: For saving sessions, we need to make sure the user is online before sending the message to save
}

export async function isInCurrentSession(uid: string): Promise<boolean> {
  const fs = admin.firestore();

  // 1. If no currentSession ref, no ongoing session.
  const currentSessUserRef = await fs
    .collection('currentSessions')
    .doc(uid)
    .get();
  const data = currentSessUserRef.data();
  if (!data) {
    return false;
  }

  const sessId = data['sessId'];

  // 2. If partner is still online, we take it that the session is ongoing.
  const partnerId = await findSessionPartner(uid, sessId);
  if (await isOnline(partnerId)) {
    return true;
  }

  // 3. If elapsed time of that currentSession is below some threshold, we take it that the session is ongoing.
  // 5 hours in milliseconds
  const THRESHOLD = 5 * 60 * 60 * 1000;
  const timeElapsed = await getTimeElapsed(sessId);
  const currentTime = Date.now();
  if (currentTime - timeElapsed < THRESHOLD) {
    return true;
  }

  // Exceeded threshold
  await endSession(sessId);
  return false;
}

export async function getCurrentSessionId(uid: string): Promise<string | null> {
  if (!(await isInCurrentSession(uid))) {
    return null;
  }

  const fs = admin.firestore();
  const docRef = await fs.collection('currentSessions').doc(uid).get();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return docRef.data()!['sessId'];
}

export async function initSession(
  uid1: string,
  uid2: string,
  lvl: string
): Promise<void> {
  const sessRtdbPath = admin.database().ref('/sessions');
  const qnsId = await getRandomQuestion(lvl);
  const qns = await getQuestion(qnsId);

  const users = [uid1, uid2];
  const session = {
    users,
    qnsId,
    startedAt: Date.now(),
    defaultWriter: users[0],
    language: qns.templates[0].value,
  };

  const sessId = (await sessRtdbPath.push(session)).key;
  const sessFsPath = admin.firestore().doc(`/sessions/${sessId}`);

  await sessFsPath.set({
    users,
    qnsId,
    startedAt: session.startedAt,
    status: SESS_STATUS_STARTED,
  });

  const foundSessionData = { sessId, qnsId };
  for (const user of users) {
    await sendMessage(user, FOUND_SESSION, foundSessionData);
    await admin.firestore().collection('currentSessions').doc(user).set({
      sessId: sessId,
    });
  }

  // Write Default Code
  // const writeDefaultCodeData = { sessId, qnsId };
  // await sendMessage(users[0], WRITE_DEFAULT_CODE, writeDefaultCodeData);
  return;
}
