import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { randomBytes } from 'crypto';
import { ALL_LVLS, LVL_EASY, LVL_MEDIUM, LVL_HARD } from '../consts/values';

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

export async function getRandomQuestion(level: string): Promise<string> {
  // See https://stackoverflow.com/questions/46798981/firestore-how-to-get-random-documents-in-a-collection for more info

  if (!ALL_LVLS.includes(level.toLowerCase())) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `The level must be one of ${LVL_EASY}, ${LVL_MEDIUM}, ${LVL_HARD}`
    );
  }

  const db = admin.firestore();

  const questionRef = db.collection(`randomQuestions/algorithms/${level}`);
  const randomKey = autoId();

  let snapshot = await questionRef
    .where(admin.firestore.FieldPath.documentId(), '>=', randomKey)
    .limit(1)
    .get();

  if (snapshot.empty) {
    snapshot = await questionRef
      .where(admin.firestore.FieldPath.documentId(), '<=', randomKey)
      .limit(1)
      .get();
  }

  const qns = snapshot.docs[0].data();
  return qns.slug;
}

export async function getQuestion(id: string): Promise<any> {
  const db = admin.firestore();
  const docRef = db.doc(`questions/${id}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Question with id cannot be found'
    );
  }

  return snap.data();
}
