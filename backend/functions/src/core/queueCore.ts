import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { addUserToTimeoutQueue } from '../tasks/matchTimeout';
import {
  RUNNING_IN_EMULATOR,
  ALL_LVLS,
  LVL_EASY,
  LVL_MEDIUM,
  LVL_HARD,
} from '../consts/values';
import { isInCurrentSession } from './sessionCore';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function validateAndGetLevel(data: any, keyName = 'queueName'): string {
  if (!data || !data[keyName] || data[keyName].length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `The function must be called with a single argument ${keyName}`
    );
  }

  const lvl = data[keyName].toLowerCase();

  if (!ALL_LVLS.includes(lvl)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `The queueName must be one of ${LVL_EASY}, ${LVL_MEDIUM}, ${LVL_HARD}`
    );
  }

  return lvl;
}

export async function removeUserFromQueue(
  uid: string,
  queueName: string
): Promise<void> {
  const queue = (
    await admin.database().ref(`/queues/${queueName}`).once('value')
  ).val() as string[];

  if (queue === null) {
    return;
  }

  // We assume that user is only added to the queue once
  const elemIdx = queue.indexOf(uid);
  if (elemIdx > -1) {
    queue.splice(elemIdx, 1);
    await admin.database().ref(`/queues/${queueName}`).set(queue);
  }

  // Remove matchTimeoutTask if present
  await removeMatchTimeoutTask(uid);

  return;
}

export async function addUserToQueue(
  uid: string,
  queueName: string
): Promise<void> {
  if (await isInCurrentSession(uid)) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'User is already in an active session'
    );
  }

  const oldQueueName = await getQueueUserIsIn(uid);
  if (oldQueueName !== null) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      `User is already in ${oldQueueName}!`
    );
  }

  const queuePath = admin.database().ref(`/queues/${queueName.toLowerCase()}`);
  let queue: string[] = (await queuePath.once('value')).val();

  if (queue === null) {
    queue = [];
  }

  queue.push(uid);
  await queuePath.set(queue);

  if (!RUNNING_IN_EMULATOR) {
    const task = await addUserToTimeoutQueue({
      userId: uid,
      queueName: queueName,
    });
    await recordMatchTimeoutTask(task.id, uid);
  }

  functions.logger.log(`Successfully added user ${uid} to ${queueName} queue`);
  return;
}

export async function getQueueUserIsIn(uid: string): Promise<string | null> {
  for (const lvl of ALL_LVLS) {
    const queuePath = admin.database().ref(`/queues/${lvl}`);
    const queue: string[] = (await queuePath.get()).val();

    if (queue === null) {
      continue;
    }

    if (queue.includes(uid)) {
      return lvl;
    }
  }

  return null;
}

export async function recordMatchTimeoutTask(
  taskId: string,
  userId: string
): Promise<void> {
  const firestore = admin.firestore();
  await firestore.doc(`matchTimeoutTasks/${userId}`).set({ taskId });
}

export async function removeMatchTimeoutTask(userId: string): Promise<void> {
  const firestore = admin.firestore();
  await firestore.doc(`matchTimeoutTasks/${userId}`).delete();
}

export async function getMatchTimeoutTask(userId: string): Promise<any> {
  const firestore = admin.firestore();
  return (await (
    await firestore.doc(`matchTimeoutTasks/${userId}`).get()
  ).data()) as any;
}
