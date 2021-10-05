import firebase from 'firebase';

import firebaseOptions from './firebaseOptions';

const app = firebase.initializeApp(firebaseOptions);

export default app;
