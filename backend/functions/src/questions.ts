import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';
import { randomBytes } from 'crypto';

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
      // throw error
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Question with id cannot be found'
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

  const questionRef = db.collection(`randomQuestions/algorithms/${difficulty}`);
  const randomKey = autoId();

  const snapshot = await questionRef
    .where(admin.firestore.FieldPath.documentId(), '>', randomKey)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new functions.https.HttpsError(
      'internal',
      'Unable to retrieve random question, empty snapshot found'
    );
  }

  let questionSlug = '';
  snapshot.forEach((doc) => {
    questionSlug = doc.data().slug;
  });
  return questionSlug;
};

// Adapted from https://github.com/firebase/firebase-js-sdk/blob/master/packages/firestore/src/util/misc.ts
function autoId(): string {
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // The largest byte value that is a multiple of `char.length`.
  const maxMultiple = Math.floor(256 / chars.length) * chars.length;

  let autoId = '';
  const targetLength = 20;
  while (autoId.length < targetLength) {
    const bytes = randomBytes(40);
    for (let i = 0; i < bytes.length; ++i) {
      // Only accept values that are [0, maxMultiple), this ensures they can
      // be evenly mapped to indices of `chars` via a modulo operation.
      if (autoId.length < targetLength && bytes[i] < maxMultiple) {
        autoId += chars.charAt(bytes[i] % chars.length);
      }
    }
  }

  return autoId;
}
