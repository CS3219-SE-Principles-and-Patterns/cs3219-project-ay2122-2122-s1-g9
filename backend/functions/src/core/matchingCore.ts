import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSession } from './sessionCore';
import { isOnline } from './presenceCore';
import { removeUserFromQueue } from './queueCore';

export async function processQueue(
  queueSnapshot: string[],
  lvl: string
): Promise<void> {
  const queuePath = admin.database().ref(`/queues/${lvl}`);

  if (!queueSnapshot || queueSnapshot.length == 0) {
    functions.logger.log(
      `${lvl} queue has nothing to be processed. Exiting function`
    );
    return;
  }

  const queue: string[] = [];

  for (const user of queueSnapshot) {
    if (await isOnline(user)) {
      queue.push(user);
    } else {
      await removeUserFromQueue(user, lvl);
    }
  }

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
