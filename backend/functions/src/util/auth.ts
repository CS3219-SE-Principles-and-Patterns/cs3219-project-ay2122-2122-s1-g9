import * as functions from 'firebase-functions';

import { CallableContext } from 'firebase-functions/v1/https';

export function validateAndGetUid(context: CallableContext): string {
  if (!context || !context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function can only be called by a logged in user.'
    );
  }

  return context.auth.uid;
}
