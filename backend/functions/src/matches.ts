import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getRandomQuestion } from './util/question';
import { sendMessage } from './util/message';

export const detectMatchesCreateSession = functions.database
  .ref('/queues/{difficulty}')
  .onWrite(async (change, context) => {
    const queueName = context.params.difficulty;
    const MAX_NUMBER_OF_TRIES = 5;

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

      // Try 5 times to get a random question, our random key may not always work
      let questionId = null;
      let retries = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          questionId = await getRandomQuestion(queueName);
          break;
        } catch (err) {
          if (retries >= MAX_NUMBER_OF_TRIES) {
            // Remove both users from queue, ask them to rejoin
            queue.shift();
            queue.shift();

            // Send an error to both users' message queues
            for (const user of users) {
              await sendMessage(
                user,
                'QUESTION_GENERATION_ERROR',
                'Unable to generate question for session. Please rejoin the queue'
              );
            }

            return { sucess: false };
          }
        }
        retries++;
      }

      // First we create a session
      const session = {
        users,
        createdAt: Date.now(),
        questionId: questionId,
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
