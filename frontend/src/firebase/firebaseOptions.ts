import { FirebaseOptions } from '@firebase/app-types';

const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '';
const FIREBASE_DATABASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL || '';
const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET =
  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_MESSAGING_SENDER_ID =
  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '';
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID || '';

const options: FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

export { FIREBASE_PROJECT_ID };
export default options;
