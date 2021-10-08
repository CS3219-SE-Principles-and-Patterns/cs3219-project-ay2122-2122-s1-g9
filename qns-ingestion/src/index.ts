import dotenv from 'dotenv';

dotenv.config();

import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

import firebaseOptions from './firebaseOptions';
import { writeDictForRandom, writeQnsDict } from './firestore';
import { createDictForRandom, readQuestions } from './questions';

const QNS_DIR = './questions';

async function main() {
  const app = initializeApp(firebaseOptions);
  const db = getFirestore(app);

  if (process.env.USE_EMULATOR) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }

  const qnsDict = readQuestions(QNS_DIR);
  const dictForRandom = createDictForRandom(qnsDict);
  await writeQnsDict(db, qnsDict);
  await writeDictForRandom(db, dictForRandom);
}

(async () => {
  await main();
  process.exit();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
