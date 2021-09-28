import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContext {
  user: Types.User | null;
  setUser: React.Dispatch<React.SetStateAction<Types.User | null>>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC = function (props) {
  const { children } = props;

  const [user, setUser] = useState<Types.User | null>(null);

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
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = function () {
  return useContext(AuthContext);
};

export default useAuth;
