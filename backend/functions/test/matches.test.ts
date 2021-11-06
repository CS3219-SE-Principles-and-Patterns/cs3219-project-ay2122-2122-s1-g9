import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as sinon from 'sinon';
import { expect } from './testUtil/chai';
import fft from './testUtil/fft';

import { matches } from '../src/index';
import { createOnlineUser } from './testUtil/factory';
import * as questionCore from '../src/core/questionCore';

describe('detectMatchesCreateSession', () => {
  const func = fft.wrap(matches.detectMatchesCreateSession);

  describe('one user in queue', () => {
    it('should leave the user alone', async () => {
      const uid = await createOnlineUser();

      const change = functions.Change.fromObjects(
        fft.database.makeDataSnapshot([], '/queues/easy'),
        fft.database.makeDataSnapshot([uid], '/queues/easy')
      );

      await admin.database().ref('/queues/easy').set([uid]); // manually write the user into queue
      await func(change, { params: { difficulty: 'easy' } }); // trigger the onwrite function

      const createdSnap = await admin
        .database()
        .ref('/queues/easy')
        .once('value');
      expect(createdSnap.val()).to.deep.equal([uid]);
    });
  });

  describe('two users in queue', () => {
    it('should create a session for the users', async () => {
      const stub = sinon
        .stub(questionCore, 'getRandomQuestion')
        .returns(Promise.resolve('two-sum'));

      // TODO: Can change to question fixture here
      const stub2 = sinon.stub(questionCore, 'getQuestion').returns(
        Promise.resolve({
          slug: 'two-sum',
          id: 1,
          category: 'algorithms',
          desc: 'a description of the problem',
          templates: [{ value: 'cpp' }],
        })
      );

      const db = admin.database();

      const uid1 = await createOnlineUser();
      const uid2 = await createOnlineUser();

      const change = functions.Change.fromObjects(
        fft.database.makeDataSnapshot([uid1], '/queues/easy'),
        fft.database.makeDataSnapshot([uid1, uid2], '/queues/easy')
      );

      await admin.database().ref('/queues/easy').set([uid1, uid2]); // manually write the users into queue
      await func(change, { params: { difficulty: 'easy' } }); // should trigger the onWrite

      expect((await db.ref('/queues/easy').once('value')).val()).to.be.null;

      const createdSnap = await db
        .ref('/sessions')
        .limitToLast(1)
        .once('value');
      expect(createdSnap).to.not.be.null;

      stub.restore();
      stub2.restore();
    }).timeout(5000);
  });
});
