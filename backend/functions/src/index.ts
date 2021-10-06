import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const getQuestion = functions.https.onCall(async (request, context) => {
  // request
  // { "slug": two-sums }

  if (!request || !request.slug || request.slug.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with " +
      "one arguments \"slug\", the title of the question.");
  }

  const db = admin.firestore();

  const slug = request.slug;
  const docRef = db.doc(`questions/${slug}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    // throw error
    throw new functions.https.HttpsError("invalid-argument",
        "Question with slug cannot be found");
  }

  return snap.data();
});
