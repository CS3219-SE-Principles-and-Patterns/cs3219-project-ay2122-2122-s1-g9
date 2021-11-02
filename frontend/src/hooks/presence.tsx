import 'firebase/database';

import firebase from 'firebase/app';
import { useEffect } from 'react';

import useAuth from './auth';

const isOfflineForDatabase = {
  state: 'offline',
  lastUpdated: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  lastUpdated: firebase.database.ServerValue.TIMESTAMP,
};

const usePresence = function () {
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user?.uid == null) {
      return;
    }

    // See https://firebase.google.com/docs/firestore/solutions/presence
    const uid = auth.user.uid;
    const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

    firebase
      .database()
      .ref('.info/connected')
      .on('value', (snapshot) => {
        if (snapshot.val() == false) {
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  });
};

export default usePresence;
