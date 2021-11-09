import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as matches from './matches';
import * as questions from './questions';
import * as queues from './queues';
import * as sessions from './sessions';
import functionBuilder from './functionBuilder';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functionBuilder.https.onRequest(
  (request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
  }
);

export { matches, questions, queues, sessions };
