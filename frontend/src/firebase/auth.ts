// Add calls to firebase service here
import { FirebaseError } from '@firebase/util';
import firebase from 'firebase/app';

import firebaseApp from './firebaseApp';

const {
  FacebookAuthProvider,
  GoogleAuthProvider,
  Auth: { Persistence },
} = firebase.auth;

const auth = firebaseApp.auth();

const createUser = async (email: string, password: string) => {
  try {
    // Signed in
    const userCredential = await auth.createUserWithEmailAndPassword(
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

interface SocialLoginParams {
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
  social: 'google' | 'facebook';
  setAuthError?: React.Dispatch<React.SetStateAction<string | null>>;
}

const socialLogin = async ({
  setUser,
  social,
  setAuthError,
}: SocialLoginParams) => {
  try {
    await auth.setPersistence(Persistence.LOCAL);
    let provider: firebase.auth.AuthProvider;
    switch (social) {
      case 'facebook':
        provider = new FacebookAuthProvider();
        console.log(provider, 'fbprovider');
        break;

      case 'google':
        provider = new GoogleAuthProvider();
        console.log(provider, 'gprovider');
        break;

      default:
        throw new Error('Unsupported SNS' + social);
    }

    const userCredential = await auth.signInWithPopup(provider);
    // The signed-in user info.
    const user = userCredential.user;
    setUser(user);
    return user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorCode = error?.code;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      setAuthError?.(
        'Your Facebook account uses the same email as your Google one. Please login with Google instead.'
      );
    }

    const errorMessage = error?.message;
    const credential = error?.credential;

    console.log(
      `ErrorCode: ${errorCode} ErrorMessage: ${errorMessage} Credential: ${JSON.stringify(
        credential
      )}`
    );
    return null;
  }
};

const signOut = async () => {
  await auth.signOut();
};

const observeAuthState = (
  setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>,
  setPending: React.Dispatch<React.SetStateAction<boolean>>
) =>
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setPending(false);
  });

export { createUser, observeAuthState, signOut, socialLogin };
