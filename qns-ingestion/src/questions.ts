import fs from 'fs';

import { QnsDictForRandom, Question, QuestionDict } from './questionTypes';

function readQuestions(qnsDir: string): QuestionDict {
  const exclusions = ['.DS_STORE', 'problems.json', 'translationConfig.json'];

  let arr = fs.readdirSync(qnsDir);
  arr = arr.filter((filename) => !exclusions.includes(filename));
  arr = arr.map((filename) => qnsDir + '/' + filename);

  const qnsDict: { [id: string]: Question } = {};
  for (const filename of arr) {
    const qns: Question = JSON.parse(fs.readFileSync(filename).toString());
    qns.level = qns.level.toLowerCase();
    qnsDict[qns.slug] = qns;
  }

  return qnsDict;
}

function createDictForRandom(qnsDict: QuestionDict): QnsDictForRandom {
  // https://stackoverflow.com/questions/46798981/firestore-how-to-get-random-documents-in-a-collection
  const results: QnsDictForRandom = {};

  for (const qns of Object.values(qnsDict)) {
    if (!results.hasOwnProperty(qns.category)) {
      results[qns.category] = { easy: [], medium: [], hard: [] };
    }

    results[qns.category][qns.level].push({
      id: qns.id,
      slug: qns.slug,
    });
  }

  return results;
}

export { createDictForRandom, readQuestions };
