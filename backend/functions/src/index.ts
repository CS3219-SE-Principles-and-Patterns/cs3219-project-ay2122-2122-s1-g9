import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

import * as matches from './matches';
import * as questions from './questions';
import * as queues from './queues';
import * as sessions from './sessions';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const stubToInitSession = functions.https.onCall(async (data, context) => {
  const results = sessions.initSession('ivantest2', 'two-sum');
  return results
})

export { matches, questions, queues, sessions };
