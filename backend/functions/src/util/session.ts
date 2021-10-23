import * as admin from 'firebase-admin';
import { isOnline } from './presence';
import { SESS_STATUS_ENDED } from '../consts/values';

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

export async function getTimeElapsed(sessId: string): number {
  const sess = await getSession(sessId);
  return sess['createdAt'];
}

export async function findSessionPartner(uid: string, sessId: string): string {
  const sess = await getSession(sessId);
  const users = sess['users'];

  if (users[0] == uid) {
    return users[1];
  }

  return users[0];
}

export async function endSession(sessId: string): void {
  const fs = admin.firestore();
  const db = admin.database();

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

  const stopSessionNotif = {
    sessId,
    type: 'STOP_SESSION',
  };

  for (const uid of sess.users) {
    await db.ref(`/users/${uid}`).push(stopSessionNotif);
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

  if (!currentSessUserRef.exists) {
    return false;
  }

  const sessId = currentSessUserRef.data()['sessId'];

  // 2. If partner is still online, we take it that the session is ongoing.
  const partnerId = await findSessionPartner(uid, sessId);
  console.log(partnerId);
  if (await isOnline(partnerId)) {
    // console.log('hello');
    return true;
  }

  console.log('bye');

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
  return docRef.data()['sessId'];
}
