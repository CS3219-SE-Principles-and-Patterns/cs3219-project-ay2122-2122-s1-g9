import fs from 'fs';

import { Question, QuestionDict, QuestionIdentifier  } from './questionTypes';

function readQuestions(qnsDir: string): QuestionDict {
	const exclusions = [".DS_STORE", "problems.json", "translationConfig.json"];

  let arr = fs.readdirSync(qnsDir);
  arr = arr.filter((filename) => !exclusions.includes(filename));
  arr = arr.map((filename) => qnsDir + "/" + filename);

	const questions = [];
	arr = arr.slice(0, 2);

	const qnsDict: { [id: string]: Question } = {}
	for (const filename of arr) {
		const qns: Question = JSON.parse(fs.readFileSync(filename).toString());
		qnsDict[qns.slug] = qns;
	}

	return qnsDict;
}

function createDictForRandom(qnsDict: QuestionDict) {
	// https://stackoverflow.com/questions/46798981/firestore-how-to-get-random-documents-in-a-collection
	const results: { [category: string]: { [difficulty: string]: QuestionIdentifier[] }}= {};

	for (const [key, qns] of Object.entries(qnsDict)) {
		if (!results.hasOwnProperty(qns.category)) {
			results[qns.category] = {"Easy": [], "Medium": [], "Hard": []};
		}

		console.log(qns.category);
		console.log(qns.level);

		results[qns.category][qns.level].push({
			id: qns.id,
			slug: qns.slug,
		});	
	}

	return results;
}


function createCategoryDict() {

}


export { readQuestions, createDictForRandom };
