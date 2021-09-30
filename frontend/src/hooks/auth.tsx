import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { observeAuthState, socialLogin } from '../firebase/auth';

interface AuthContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC = function (props) {
  const { children } = props;

  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const signInWithGoogle = async () => {
    await socialLogin({ setUser, social: 'google' });
  };

  const signInWithFacebook = async () => {
    await socialLogin({ setUser, social: 'facebook', setAuthError });
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
      value={{ user, setUser, signInWithGoogle, signInWithFacebook, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = function () {
  return useContext(AuthContext);
};

export default useAuth;
