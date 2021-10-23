import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as matches from './matches';
import * as questions from './questions';
import * as queues from './queues';
import * as sessions from './sessions';
import { isInCurrentSession } from './util/session';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

// Used to test functions
// export const tester = functions.https.onCall((data: any, context) => {
//   return isInSession('c');
// });

export { matches, questions, queues, sessions };
