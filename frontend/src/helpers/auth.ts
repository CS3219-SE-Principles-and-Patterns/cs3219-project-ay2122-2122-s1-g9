// Add calls to firebase service here
import { createUserWithEmailAndPassword, getAuth } from '@firebase/auth';
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

export { createUser };
