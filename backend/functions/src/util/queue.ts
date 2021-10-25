import * as admin from 'firebase-admin';

export async function removeUserFromQueue(
  uid: string,
  queueName: string
): Promise<boolean> {
  const queue = (
    await admin.database().ref(`/queues/${queueName}`).once('value')
  ).val() as string[];

  if (queue == null) {
    return true;
  }

  // We assume that user is only added to the queue once
  const elemIdx = queue.indexOf(uid);
  if (elemIdx > -1) {
    queue.splice(elemIdx, 1);
    await admin.database().ref(`/queues/${queueName}`).set(queue);
  }

  return true;
}
