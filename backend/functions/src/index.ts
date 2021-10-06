import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const getQuestion = functions.https.onCall(async (data, context: CallableContext) => {
  // request
  // { "slug": two-sums }

  if (!data || !data.slug || data.slug.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with ' +
        'one arguments "slug", the title of the question.'
    );
  }

  const db = admin.firestore();
  const docRef = db.doc(`questions/${request.slug}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    // throw error
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Question with slug cannot be found'
    );
  }

  return snap.data();
});
