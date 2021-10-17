import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

import { detectMatchCreateSession } from './match';
import { addUserToQueue } from './queue';
import * as questions from './questions';
import { initSession } from './sessions';


admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const getQuestion = functions.https.onCall(async (data: App.getQuestionData, context: CallableContext) => {
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
    // throw error
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Question with id cannot be found'
    );
  }
});

export const stubToInitSession = functions.https.onCall(async (data, context) => {
  const results = initSession('ivantest2', 'two-sum');
  return results
})

export const matchAndCreateSession = detectMatchCreateSession;
export const addUserToQuestionQueue = addUserToQueue;
