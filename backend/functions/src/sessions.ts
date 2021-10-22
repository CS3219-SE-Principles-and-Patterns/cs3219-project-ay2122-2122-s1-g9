import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SESS_STATUS_ENDED, SESS_STATUS_STARTED } from './consts/values';
import { validateAndGetUid } from './util/auth';
import { getCurrentSessionId, getSession } from './util/util';
import { SUCCESS_MSG } from './consts/messages';

export const initSession = functions.database
  .ref('/sessions/{sessId}')
  .onCreate(
    async (
      snapshot: functions.database.DataSnapshot,
      _context: functions.EventContext
    ) => {
      const db = admin.database();
      const fs = admin.firestore();

      const sessFromDb = snapshot.val();
      const sessId = snapshot.key;
      const users: string[] = sessFromDb['users'];

      if (users.length != 2) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `There should only be 2 users in a session. Found ${users.length} at session ${sessId}.`
        );
      }

      const qnsId = 'two-sum'; // this could be derived from this function or the matches one

      // Initialize session in firestore
      await fs.collection('sessions').doc(sessId).set({
        users,
        qnsId,
        createdAt: sessFromDb['createdAt'],
        status: SESS_STATUS_STARTED,
      });

      // Initialize session for user
      const foundSessNotif = {
        sessId,
        type: 'FOUND_SESSION',
      };

      for (const user of users) {
        const userPath = db.ref(`/users/${user}`);
        await userPath.push(foundSessNotif);

        await fs.collection('currentSessions').doc(user).set({
          sessId: sessId,
        });
      }

      // Write Default Code
      const writeDefaultCodeNotif = {
        sessId,
        qnsId,
        type: 'WRITE_DEFAULT_CODE',
      };

      const userToWrite = users[0];
      await db.ref(`/users/${userToWrite}`).push(writeDefaultCodeNotif);
    }
  );

export const stopSession = functions.https.onCall(
  async (data: any, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const sessId = await getCurrentSessionId(uid);
    if (!sessId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'User is not in a current session.'
      );
    }

    const sess = await getSession(sessId);
    if (!sess) {
      throw new functions.https.HttpsError(
        'not-found',
        'Session cannot be found.'
      );
    }

    const fs = admin.firestore();
    const db = admin.database();

    const sessRef = fs.collection('sessions').doc(sessId);
    await sessRef.update({
      status: SESS_STATUS_ENDED,
      endedAt: Date.now(),
    });

    const stopSessionNotif = {
      sessId,
      type: 'STOP_SESSION',
    };

    for (const uid of sess.users) {
      const currentSessUserRef = fs.collection('currentSessions').doc(uid);
      await currentSessUserRef.delete();
      await db.ref(`/users/${uid}`).push(stopSessionNotif);
    }

    return SUCCESS_MSG;
  }
);
