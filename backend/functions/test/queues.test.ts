import * as admin from 'firebase-admin';
import { queues } from '../src/index';
import { createOnlineUser, createSession } from './testUtil/factory';
import { expect } from './testUtil/chai';
import fft from './testUtil/fft';

import { NO_MATCH_FOUND } from '../src/consts/msgTypes';

describe('addUserToQueue', () => {
  after(async () => {
    await admin.database().ref('/queues').set(null);
  });

  it('should add user to queue', async () => {
    // addUserToQueue function does not use cloud tasks when run in tests
    const func = fft.wrap(queues.addUserToQueue);
    const data = { queueName: 'easy' };
    await func(data, { auth: { uid: 'fakeuid' } });

    await admin
      .database()
      .ref('/queues/easy')
      .once('value', (snapshot) => {
        expect(snapshot.val()).to.contain('fakeuid');
      });
  });
});

describe('removeUserFromQueue', () => {
  const func = fft.wrap(queues.removeUserFromQueue);

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
  const func = queues.removeUnmatchedUserAfterTimeout;

  // Mocked response object to let function execute successfully
  const res = {
    status: () => res,
    json: () => res,
  };

  describe('in current session', () => {
    it('should exit successfully', async () => {
      const sess = await createSession();
      const userId1 = sess.users[0];
      const req = {
        body: { userId: userId1, queueName: 'easy' },
      };

      // Firebase does not have good support to run tests written in ts.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await func(req, res);

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
      const userId = await createOnlineUser();
      const db = admin.database();
      await db.ref('/queues/easy').set([userId]);

      const req = {
        body: { userId, queueName: 'easy' },
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await func(req, res);

      await db.ref('/queues/easy').once('value', (snapshot) => {
        // If there is nothing in queue, the val will be null
        expect(snapshot.val()).to.be.null;
      });

      await db
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
