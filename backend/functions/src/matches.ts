import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getRandomQuestion } from './util/question';

export const detectMatchesCreateSession = functions.database
  .ref('/queues/{difficulty}')
  .onWrite(async (change, context) => {
    const queueName = context.params.difficulty;

    // Exit when the data is deleted.
    if (!change.after.exists()) {
      return null;
    }

    const queue = change.after.val();

    // queue should not be empty
    if (queue == null) {
      return null;
    }

    // queue should only have 2 people in it
    if (queue.length < 2) {
      functions.logger.log(
        `queue ${queueName} does not have at least 2 people`
      );
      return null;
    }

    const sessionPath = admin.database().ref('/sessions');
    const queuePath = admin.database().ref('/queues');

    // We will make 1 match for every 2 people in the queue
    const numOfMatches = Math.floor(queue.length / 2);
    let count = 0;

    while (count < numOfMatches) {
      const users = [queue[0], queue[1]];

      const qnsId = await getRandomQuestion(queueName);

      // First we create a session
      const session = {
        users,
        qnsId,
        startedAt: Date.now(),
      };

      sessionPath.push(session);

      // Pop the first 2 elements from the queue
      queue.shift();
      queue.shift();
      count++;
    }

    // Update the queue to only contain the unmatched people
    queuePath.child(queueName).set(queue);

    return { sucess: true };
  });
