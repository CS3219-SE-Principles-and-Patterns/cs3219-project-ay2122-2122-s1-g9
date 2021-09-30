// Add calls to firebase service here
import {
  AuthProvider,
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

interface SocialLoginParams {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  social: 'google' | 'facebook';
  setAuthError?: React.Dispatch<React.SetStateAction<string | null>>;
}

const socialLogin = async ({
  setUser,
  social,
  setAuthError,
}: SocialLoginParams) => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    let provider: AuthProvider;
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

    const userCredential = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = userCredential.user;
    setUser(user);
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        setAuthError?.(
          'Your Facebook account uses the same email as your Google one. Please login with Google instead.'
        );
      }

      const errorMessage = error.message;
      const credential =
        social == 'facebook'
          ? FacebookAuthProvider.credentialFromError(error)
          : GoogleAuthProvider.credentialFromError(error);

      console.log(
        `ErrorCode: ${errorCode} ErrorMessage: ${errorMessage} Credential: ${JSON.stringify(
          credential
        )}`
      );
    }
    return null;
  }
};

const observeAuthState = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setPending: React.Dispatch<React.SetStateAction<boolean>>
) =>
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setPending(false);
  });

export { createUser, observeAuthState, socialLogin };
