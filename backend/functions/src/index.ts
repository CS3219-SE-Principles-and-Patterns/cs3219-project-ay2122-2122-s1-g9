import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

import { detectMatchCreateSession } from './match';
import { addUserToQueue } from './queue';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const getQuestion = functions.https.onCall(
  async (data: App.getQuestionData, context: CallableContext) => {
    // data: { "slug": "two-sum" }

    if (!data || !data.slug || data.slug.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with ' +
          'one arguments "slug", the title of the question.'
      );
    }

    const db = admin.firestore();
    const docRef = db.doc(`questions/${data.slug}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      // throw error
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Question with slug cannot be found'
      );
    }

    return snap.data();
  }
);

export const getRandomQuestion = async function (
  difficulty: string
): Promise<string> {
  const validQueues = new Set(['easy', 'medium', 'hard']);

  if (!validQueues.has(difficulty.toLowerCase())) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The difficultyLevel must be one of {easy, medium, hard}'
    );
  }

  const db = admin.firestore();

  const allQuestions: unknown[] = [];
  const questionRef = db.collection(`randomQuestions/algorithms/${difficulty}`);
  const snapshot = await questionRef.get();

  snapshot.forEach(function (doc) {
    console.log(doc.data());
    allQuestions.push(doc.data());
  });
  return allQuestions[Math.floor(Math.random() * allQuestions.length)].slug;
};

export const matchAndCreateSession = detectMatchCreateSession;
export const addUserToQuestionQueue = addUserToQueue;
