import { expect } from './testUtil/chai';
import fft from './testUtil/fft';
import * as admin from 'firebase-admin';
import { questions } from '../src/index';

describe('getQuestion', () => {
  const func = fft.wrap(questions.getQuestion);
  const slug = 'two-sum';

  before(async () => {
    const data = {
      slug,
      id: 1,
      category: 'algorithms',
      desc: 'a description of the problem',
    };

    await admin.firestore().collection('questions').doc('two-sum').set(data);
  });

  it('should return a qns when given the correct id', async () => {
    const result = await func({ id: slug });
    expect(result['slug']).to.equal(slug);
  });

  it('should throw and error when question cannot be found', async () => {
    const result = func({ id: 'wrong-id' });
    expect(result).to.eventually.be.rejected;
  });
});
