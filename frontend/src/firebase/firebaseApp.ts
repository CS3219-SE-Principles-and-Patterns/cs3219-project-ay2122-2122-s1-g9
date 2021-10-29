import 'firebase/auth';
import 'firebase/functions';
import 'firebase/database';

import firebase from 'firebase/app';

import firebaseOptions from './firebaseOptions';

const app = firebase.initializeApp(firebaseOptions);

if (process.env.REACT_APP_USE_EMULATOR) {
  app.auth().useEmulator('http://localhost:9099');
  app.functions().useEmulator('localhost', 5001);
  app.database().useEmulator('localhost', 9000);
  console.log('Using auth, functions and rtdb emulators');
}

export default app;
