import dotenv from 'dotenv';

dotenv.config();

import fs from "fs";

import { initializeApp } from "@firebase/app";
import { getFirestore, connectFirestoreEmulator, } from "@firebase/firestore";

import firebaseOptions from './firebaseOptions';
import { createDictForRandom, readQuestions } from './questions';
import { Question } from './questionTypes';
import { writeDictForRandom, writeQnsDict } from './firestore';

const QNS_DIR = "./questions";

async function main() {
  const app = initializeApp(firebaseOptions);
  const db = getFirestore(app);
  connectFirestoreEmulator(db, "localhost", 8080);

  // try {
  //   const docRef = await addDoc(collection(db, "users"), {
  //     first: "Ada",
  //     last: "Lovelace",
  //     born: 1815,
  //   });
  //   console.log("Document written with ID: ", docRef.id);
  // } catch (e) {
  //   console.error("Error adding document: ", e);
  // }

  // console.log("hello")

  const qnsDict = readQuestions(QNS_DIR);
  const dictForRandom = createDictForRandom(qnsDict);
  await writeQnsDict(db, qnsDict);
  await writeDictForRandom(db, dictForRandom);
}

(async () => {
  await main();
  process.exit();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
