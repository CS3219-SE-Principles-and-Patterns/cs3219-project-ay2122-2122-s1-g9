import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { facebookLogin, googleLogin } from '../helpers/auth';

interface AuthContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC = function (props) {
  const { children } = props;

  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    const userFromGoogle = await googleLogin();
    setUser(userFromGoogle);
  };

  const signInWithFacebook = async () => {
    const userFromFacebook = await facebookLogin();
    setUser(userFromFacebook);
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    // TODO: replace the unsubscribe this function once firebase is ready
    const unsubscribe = () => {
      console.log('unsub');
    };
    // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     setUser(user);
    //   } else {
    //     setUser(null);
    //   }
    // });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, signInWithGoogle, signInWithFacebook }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = function () {
  return useContext(AuthContext);
};

export default useAuth;
