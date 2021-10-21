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
    const func = test.wrap(queues.addUserToQueue);
    const data = { queueName: 'easy' };
    await func(data, { auth: { uid: 'fakeuid' } });

    await admin.database().ref('/queues/easy').once('value', (snapshot) => {
      expect(snapshot.val()).to.contain('fakeuid');
    })
  })
})

describe('removeUserFromQueue', () => {
  after(async () => {
    test.cleanup();
    await admin.database().ref('/queues').set(null);
  })

  it ('should remove user from queue', async () => {
    const func = test.wrap(queues.removeUserFromQueue);
    await admin.database().ref('/queues/easy').set(['fakeuid']); 
    await func({}, { auth: { uid: 'fakeuid' } });

    await admin.database().ref('/queues/easy').once('value', (snapshot) => {
      expect(snapshot.val()).to.not.contain('fakeuid');
    })
  })
})
