import dotenv from 'dotenv';

dotenv.config();

import { initializeApp } from "@firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, addDoc } from "@firebase/firestore";
import fs from "fs";

import firebaseOptions from './firebaseOptions';
import { readQuestions } from './questions';

const QNS_DIR = "./questions";
const EXCLUSIONS = [".DS_STORE", "problems.json", "translationConfig.json"];

console.log("Hello World");

function createQnsDict() {
  // Convert list of questions to {title_slug_1: { ...qns_data}, title_slug_2: { ...qns_data }}
}

function writeToFirebase() {
  // Write each individual document into the qns collection
}

function createDifficultyCategoryDict() {
  // {"category": {"easy": [], "medium": [], "difficult": []} }
  // {"category": {"tag": "easy": [], "medium": [], "difficult": []}}
  // {"easy": {"some_random_id": {"title_slug": asdf, "random": "asdf"}}}
  // each value in the list will be a doc with a random value field -> and title slug will also have to be inside
}

async function main() {
  // const app = initializeApp(firebaseOptions);
  // const db = getFirestore(app);
  // connectFirestoreEmulator(db, "localhost", 8080);

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
  console.log(qnsDict);
}

(async () => {
  await main();
})().catch(err => {
    console.error(err);
});