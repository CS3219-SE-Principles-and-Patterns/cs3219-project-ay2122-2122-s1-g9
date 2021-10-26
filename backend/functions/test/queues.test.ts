import { expect } from 'chai';
import * as admin from 'firebase-admin';
import { queues } from '../src/index';
import { createSession, createUser } from './util/factory';

import fft = require('firebase-functions-test');
import { NO_MATCH_FOUND } from '../src/consts/msgTypes';

const test = fft();

// Cannot test now due to usage of cloud task
// describe('addUserToQueue', () => {
//   after(async () => {
//     test.cleanup();
//     await admin.database().ref('/queues').set(null);
//   });

//   it('should add user to queue', async () => {
//     const func = test.wrap(queues.addUserToQueue);
//     const data = { queueName: 'easy' };
//     await func(data, { auth: { uid: 'fakeuid' } });

//     await admin
//       .database()
//       .ref('/queues/easy')
//       .once('value', (snapshot) => {
//         expect(snapshot.val()).to.contain('fakeuid');
//       });
//   });
// });

describe('removeUserFromQueue', () => {
  const func = test.wrap(queues.removeUserFromQueue);

  after(async () => {
    await admin.database().ref('/queues').set(null);
  });

  const testRemovalFromQueue = (lvl: string) => {
    return async () => {
      await admin.database().ref(`/queues/${lvl}`).set(['fakeuid']);
      await func({ queueName: `${lvl}` }, { auth: { uid: 'fakeuid' } });

      await admin
        .database()
        .ref(`/queues/${lvl}`)
        .once('value', (snapshot) => {
          // If there is nothing in queue, the val will be null
          expect(snapshot.val()).to.be.null;
        });
    };
  };

  it('should remove user from easy queue', testRemovalFromQueue('easy'));
  it('should remove user from medium queue', testRemovalFromQueue('medium'));
  it('should remove user from hard queue', testRemovalFromQueue('hard'));
});

describe('removeUnmatchedUserAfterTimeout', () => {
  const func = test.wrap(queues.removeUnmatchedUserAfterTimeout);

  describe('in current session', () => {
    it('should exit successfully', async () => {
      const sess = await createSession();
      const userId1 = sess.users[0];
      await func({ userId: userId1, queueName: 'easy' });

      await admin
        .database()
        .ref(`/users/${userId1}`)
        .once('value', (snapshot) => {
          expect(snapshot.val()).to.be.null;
        });
    });
  });

  describe('not in current session', () => {
    it('should remove user from queue', async () => {
      const userId = await createUser();

      await admin.database().ref('/queues/easy').set([userId]);
      await func({ queueName: 'easy', userId });

      await admin
        .database()
        .ref('/queues/easy')
        .once('value', (snapshot) => {
          // If there is nothing in queue, the val will be null
          expect(snapshot.val()).to.be.null;
        });

      await admin
        .database()
        .ref(`/users/${userId}`)
        .limitToLast(1)
        .once('value', (snapshot) => {
          snapshot.forEach((message) => {
            expect(message.val()['type']).to.be.equal(NO_MATCH_FOUND);
          });
        });
    });
  });
});
