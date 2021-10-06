import fs from 'fs';

interface QuestionTemplate {
	value: string,
	text: string,
	defaultCode: string,
}

interface Param {
	name: string;
	type: string;
}

interface Return {
	type: string;
	size: string;	
}

interface TemplateMeta {
	name: string;
	params: Param[];
	return: Return;
	manual: boolean;
}

interface Question {
  id: number;
  fid: number;
	name: string;
	slug: string;
	link: string;
	percent: number;
	level: string;
	category: string;
	totalAC: string;
	totalSubmit: string;
	likes: string;
	dislikes: string;
	desc: string;
	templates: QuestionTemplate[];
	testcase: string;
	testable: string;
	templateMeta: TemplateMeta;
	isPaidOnly: false,
	hints: string[];	
}

function readQuestions(qnsDir: string): { [id: string]: Question } {
  // Produce a list of questions [{id: ..., desc: ...}, {id: ..., desc: ...}]
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


export { readQuestions };
