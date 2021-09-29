// Add calls to firebase service here
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import { FirebaseError } from '@firebase/util';

import firebaseApp from './firebaseApp';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const createUser = async (email: string, password: string) => {
  try {
    // Signed in
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ErrorCode: ${errorCode} ErrorMessage: ${errorMessage}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
  }
};

const googleLogin = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(
        `ErrorCode: ${errorCode} ErrorMessage: ${errorMessage} Credential: ${JSON.stringify(
          credential
        )}`
      );
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return null;
  }
};

const facebookLogin = async () => {
  try {
    const userCredential = await signInWithPopup(auth, facebookProvider);
    // The signed-in user info.
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(
        `ErrorCode: ${errorCode} ErrorMessage: ${errorMessage} Credential: ${JSON.stringify(
          credential
        )}`
      );
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return null;
  }
};

export { createUser, facebookLogin, googleLogin };
