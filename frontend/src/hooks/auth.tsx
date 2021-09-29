import 'firebase/auth';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { facebookLogin, googleLogin, observeAuthState } from '../helpers/auth';

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
  const [pending, setPending] = useState<boolean>(true);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  // try to get it to work by moving it here instead
  const signInWithGoogle = async () => {
    await googleLogin(setUser);
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
    const unsubscribe = observeAuthState(setUser, setPending);
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (pending) {
    return <Spin indicator={antIcon} />;
  }

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
