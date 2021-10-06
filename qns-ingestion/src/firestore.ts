import { Firestore, setDoc, collection, doc, addDoc } from '@firebase/firestore';

import { QuestionDict, QnsDictForRandom } from './questionTypes';

async function writeQnsDict(db: Firestore, qnsDict: QuestionDict): Promise<void> {
  for (const [key, qns] of Object.entries(qnsDict)) {
		const docRef = doc(db, "questions", qns.slug);
  	await setDoc(docRef, qns);
		console.log(`Document written to Collection questions with ID ${docRef.id}`);
  }
}

async function writeDictForRandom(db: Firestore, dictForRandom: QnsDictForRandom): Promise<void> {
	// randomQuestions(C) -> algorithms(D) -> easy(C) -> auto_id containing qns (D)

	const rootCollectionRef = collection(db, "randomQuestions");

	for (const [cate, difficultyDict] of Object.entries(dictForRandom)) {
		const cateDocRef = doc(rootCollectionRef, cate);

		for (const [difficulty, questions] of Object.entries(difficultyDict)) {
			const difficultyCollectionRef = collection(cateDocRef, difficulty);

			for (const qns of questions) {
				const docRef = await addDoc(difficultyCollectionRef, qns);
				console.log(`Document written to Collection ${difficultyCollectionRef.id} with ID ${docRef.id}`);
			}
		}
	}
}

export { writeQnsDict, writeDictForRandom };
