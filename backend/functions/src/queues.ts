import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

export const addUserToQueue = functions.https.onCall(
  async (data: App.addUserToQueueVm, context: CallableContext) => {
    if (!context || !context.auth || !context.auth.uid) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function can only be called by a logged in user.'
      );
    }

    if (!data || !data.queueName || data.queueName.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a single argument "queueName"'
      );
    }

    const validQueues = new Set(['easy', 'medium', 'hard']);

    if (!validQueues.has(data.queueName.toLowerCase())) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The queueName must be one of {easy, medium, hard}'
      );
    }

    const queuePath = admin
      .database()
      .ref(`/queues/${data.queueName.toLowerCase()}`);
    const uid = context.auth.uid;

    await queuePath.once('value', (snapshot) => {
      let queue = snapshot.val();
      // If the queue does not exist (i.e its currently empty)
      if (queue == null) {
        queue = [];
      }
      queue.push(uid);
      queuePath.set(queue);
    });

    return { success: true };
  }
);

// export const removeUserFromQueue = functions.https.onCall(

// )

