import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { addUserToTimeoutQueue } from '../tasks/matchTimeout';

export async function removeUserFromQueue(
  uid: string,
  queueName: string
): Promise<void> {
  const queue = (
    await admin.database().ref(`/queues/${queueName}`).once('value')
  ).val() as string[];

  if (queue == null) {
    return;
  }

  // We assume that user is only added to the queue once
  const elemIdx = queue.indexOf(uid);
  if (elemIdx > -1) {
    queue.splice(elemIdx, 1);
    await admin.database().ref(`/queues/${queueName}`).set(queue);
  }

  return;
}

export async function addUserToQueue(
  uid: string,
  queueName: string
): Promise<void> {
  const queuePath = admin.database().ref(`/queues/${queueName.toLowerCase()}`);

  let queue: string[] = (await queuePath.once('value')).val();

  if (queue == null) {
    queue = [];
  }

  queue.push(uid);
  await queuePath.set(queue);
  await addUserToTimeoutQueue({
    userId: uid,
    queueName: queueName,
  });

  functions.logger.log(`Successfully added user ${uid} to ${queueName} queue`);
  return;
}
