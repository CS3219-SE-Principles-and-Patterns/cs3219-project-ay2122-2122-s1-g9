import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSession } from './sessionCore';

export async function processQueue(lvl: string): Promise<void> {
  const queuePath = admin.database().ref(`/queues/${lvl}`);
  // const sessionPath = admin.database().ref('/sessions');

  const queueSnapshot = await queuePath.get();

  if (!queueSnapshot.exists()) {
    functions.logger.log(
      `${lvl} queue has nothing to be processed. Exiting function`
    );
    return;
  }

  const queue: string[] = queueSnapshot.val();

  if (queue.length < 2) {
    functions.logger.log(
      `${lvl} queue does not have at least 2 people. Exiting function`
    );
    return;
  }

  // We will make 1 match for every 2 people in the queue
  const numOfMatches = Math.floor(queue.length / 2);
  let count = 0;

  while (count < numOfMatches) {
    // const users = [queue[0], queue[1]];

    // const qnsId = await questionCore.getRandomQuestion(queueName);

    // // First we create a session
    // const session = {
    //   users,
    //   qnsId,
    //   startedAt: Date.now(),
    // };

    // sessionPath.push(session);
    await initSession(queue[0], queue[1], lvl);

    // Pop the first 2 elements from the queue
    queue.shift();
    queue.shift();
    count++;
  }

  // Update the queue to only contain the unmatched people
  queuePath.set(queue);

  return;
}
