import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

export const getQuestion = functions.https.onCall(
  async (data: App.getQuestionData, _context: CallableContext) => {
    // data: { "id": "two-sum" }

    if (!data || !data.id || data.id.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with ' +
          'one argument "id", the title slug of the question.'
      );
    }

    const db = admin.firestore();
    const docRef = db.doc(`questions/${data.id}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Question with id cannot be found'
      );
    }

    return snap.data();
  }
);
