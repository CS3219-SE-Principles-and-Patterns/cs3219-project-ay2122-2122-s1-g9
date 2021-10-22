import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendMessageToUser } from './messages';

export const initSession = functions.database
  .ref('/sessions/{sessId}')
  .onCreate(
    (
      snapshot: functions.database.DataSnapshot,
      _context: functions.EventContext
    ) => {
      const db = admin.database();

      const sessPath = snapshot;
      const users: string[] = sessPath.child('users').val();

      if (users.length != 2) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `There should only be 2 users in a session. Found ${users.length} at session ${sessPath.key}.`
        );
      }

      // Add User To Session
      const foundSessNotifData = {
        sess_id: sessPath.key,
      };

      for (const user of users) {
        sendMessageToUser(user, 'FOUND_SESSION', foundSessNotifData);
      }

      // Write Default Code
      const writeDefaultCodeNotif = {
        type: 'WRITE_DEFAULT_CODE',
        sess_id: sessPath.key,
        qns_id: 'two-sum', // this could be derived from this function or the matches one
      };

      const userToWrite = users[0];
      db.ref(`/users/${userToWrite}`).push(writeDefaultCodeNotif);
    }
  );
