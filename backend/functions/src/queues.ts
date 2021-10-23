import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from 'firebase-functions/v1/https';

import {
  ALL_LVLS,
  LVL_EASY,
  LVL_HARD,
  LVL_MEDIUM,
  SUCCESS_RESP,
} from './consts/values';
import { validateAndGetUid } from './util/auth';

function validateAndGetQueueName(data: any): string {
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

export const addUserToQueue = functions.https.onCall(
  async (data: App.addUserToQueue, context: CallableContext) => {
    // TODO: Make sure the user is not already in a currentSession

    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);

    const queuePath = admin
      .database()
      .ref(`/queues/${queueName.toLowerCase()}`);

    await queuePath.once('value', (snapshot) => {
      let queue = snapshot.val();
      // If the queue does not exist (i.e its currently empty)
      if (queue == null) {
        queue = [];
      }
      queue.push(uid);
      queuePath.set(queue);
    });

    return SUCCESS_RESP;
  }
);

export const removeUserFromQueue = functions.https.onCall(
  async (data: App.removeUserFromQueue, context: CallableContext) => {
    const uid = validateAndGetUid(context);
    const queueName = validateAndGetQueueName(data);

    const queue = (
      await admin.database().ref(`/queues/${queueName}`).once('value')
    ).val() as string[];

    if (queue == null) {
      return SUCCESS_RESP;
    }

    // We assume that user is only added to the queue once
    const elemIdx = queue.indexOf(uid);
    if (elemIdx > -1) {
      queue.splice(elemIdx, 1);
      await admin.database().ref(`/queues/${queueName}`).set(queue);
    }

    return SUCCESS_RESP;
  }
);
