import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const addUserToQueue = functions.https.onCall(
  async (data: App.addUserToQueueVm) => {
    if (
      !data ||
      !data.userId ||
      !data.queueName ||
      data.queueName.length === 0
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with ' +
          'two arguments "userId" and "queueName"'
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

    queuePath.once('value', (snapshot) => {
      let queue = snapshot.val();
      // If the queue does not exist (i.e its currently empty)
      if (queue == null) {
        queue = [];
      }
      queue.push(data.userId);
      queuePath.set(queue);
    });
  }
);
