// Add calls to firebase service here
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  User,
} from '@firebase/auth';
import { FirebaseError } from '@firebase/util';

import firebaseApp from './firebaseApp';

const auth = getAuth(firebaseApp);

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

const googleLogin = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const googleProvider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    setUser(user);
    // console.log(user);
    // return user;
    // let user = null;
    // setPersistence(auth, browserSessionPersistence).then(async () => {
    //   const googleProvider = new GoogleAuthProvider();
    //   const userCredential = await signInWithPopup(auth, googleProvider); // is this why?
    //   const user = userCredential.user;
    //   console.log(user);
    //   setUser(user);
    //   // return user;
    // });

    // The signed-in user info.
    // return user;
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
    await setPersistence(auth, browserSessionPersistence);
    const facebookProvider = new FacebookAuthProvider();
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

const observeAuthState = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) =>
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('if block hit');
      setUser(user);
    } else {
      console.log('else block hit');
      setUser(null);
    }
  });

export { createUser, facebookLogin, googleLogin, observeAuthState };
