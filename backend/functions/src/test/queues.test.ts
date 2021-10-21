import { expect } from 'chai';
import * as admin from 'firebase-admin';
import { queues } from '../index';

import fft = require('firebase-functions-test')

const test = fft();

describe('addUserToQueue', () => {
  after(async () => {
    test.cleanup();
    await admin.database().ref('/queues').set(null);
  })

  it ('should add user to queue', async () => {
    const wrapped = test.wrap(queues.addUserToQueue);
    const data = { queueName: 'easy' };
    await wrapped(data, { auth: { uid: 'fakeuid' } });

    await admin.database().ref('/queues/easy').once('value', (snapshot) => {
      expect(snapshot.val()).to.contain('fakeuid');
    })
  })
})
