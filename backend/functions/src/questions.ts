import * as functions from 'firebase-functions';
import * as questionCore from './core/questionCore';
import { CallableContext } from 'firebase-functions/v1/https';

export const getQuestion = functions.https.onCall(
  async (data: App.getQuestionData, _context: CallableContext) => {
    // data: { "qnsId": "two-sum" }

    if (!data || !data.qnsId || data.qnsId.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with ' +
          'one argument "id", the title slug of the question.'
      );
    }

    return await questionCore.getQuestion(data.qnsId);
  }
);
