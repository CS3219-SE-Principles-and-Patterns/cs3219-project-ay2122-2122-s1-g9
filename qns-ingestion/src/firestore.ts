import { addDoc, collection, doc, Firestore, setDoc } from 'firebase/firestore';

import { QnsDictForRandom, QuestionDict } from './questionTypes';

async function writeQnsDict(
  db: Firestore,
  qnsDict: QuestionDict
): Promise<void> {
  console.log(
    `Inserting questions into Firestore of ${db.app.options.projectId}`
  );

  for (const qns of Object.values(qnsDict)) {
    const docRef = doc(db, 'questions', qns.slug);
    await setDoc(docRef, qns);
    console.log(
      `Document written to Collection questions with ID ${docRef.id}`
    );
  }
}

async function writeDictForRandom(
  db: Firestore,
  dictForRandom: QnsDictForRandom
): Promise<void> {
  console.log(
    `Inserting random questions into Firestore of ${db.app.options.projectId}`
  );

  // randomQuestions(C) -> algorithms(D) -> easy(C) -> auto_id containing qns (D)
  const rootCollectionRef = collection(db, 'randomQuestions');

  for (const [cate, levelDict] of Object.entries(dictForRandom)) {
    const cateDocRef = doc(rootCollectionRef, cate);

    for (const [level, questions] of Object.entries(levelDict)) {
      const levelCollectionRef = collection(cateDocRef, level);

      for (const qns of questions) {
        const docRef = await addDoc(levelCollectionRef, qns);
        console.log(
          `Document written to Collection ${levelCollectionRef.id} with ID ${docRef.id}`
        );
      }
    }
  }
}

export { writeDictForRandom, writeQnsDict };
