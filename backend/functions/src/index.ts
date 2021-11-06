import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as matches from './matches';
import * as questions from './questions';
import * as queues from './queues';
import * as sessions from './sessions';
import { FUNCTION_LOCATION } from './consts/values';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const helloWorld = functions
  .region(FUNCTION_LOCATION)
  .https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
  });

export { matches, questions, queues, sessions };
