import { Firestore, setDoc, collection, doc } from '@firebase/firestore';

import { QuestionDict } from './questionTypes';

async function writeQnsDictToFirebase(db: Firestore, qnsDict: QuestionDict): Promise<void> {
  for (const [key, qns] of Object.entries(qnsDict)) {
		const docRef = doc(db, "questions", qns.slug);
  	await setDoc(docRef, qns);
		console.log("Document written with ID ", docRef.id);
  }
}

export { writeQnsDictToFirebase}
