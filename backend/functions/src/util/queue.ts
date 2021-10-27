import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ALL_LVLS, LVL_EASY, LVL_HARD, LVL_MEDIUM } from '../consts/values';

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function validateAndGetQueueName(data: any): string {
  if (!data || !data.queueName || data.queueName.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a single argument "queueName"'
    );
  }

  if (!ALL_LVLS.includes(data.queueName.toLowerCase())) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `The queueName must be one of ${LVL_EASY}, ${LVL_MEDIUM}, ${LVL_HARD}`
    );
  }

  return data.queueName;
}
