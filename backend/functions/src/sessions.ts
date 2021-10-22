import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SESS_STATUS_STARTED } from './consts/values';

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

      const qnsId = 'two-sum';

      // Initialize session in firestore
      const docRef = fs.collection('sessions').doc(sessId);
      await docRef.set({
        users: users,
        createdAt: sessFromDb['createdAt'],
        qnsId: qnsId,
        status: SESS_STATUS_STARTED,
      });

      // Add User To Session
      const foundSessNotif = {
        type: 'FOUND_SESSION',
        sess_id: sessId,
      };

      for (const user of users) {
        const userPath = db.ref(`/users/${user}`);
        await userPath.push(foundSessNotif);
      }

      // Write Default Code
      const writeDefaultCodeNotif = {
        type: 'WRITE_DEFAULT_CODE',
        sess_id: sessId,
        qns_id: 'two-sum', // this could be derived from this function or the matches one
      };

      const userToWrite = users[0];
      await db.ref(`/users/${userToWrite}`).push(writeDefaultCodeNotif);
    }
  );

// export const stopSession = functions.https
