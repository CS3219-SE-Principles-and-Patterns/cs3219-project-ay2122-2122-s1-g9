import { useEffect } from 'react';
import { useHistory } from 'react-router';

import firebaseApp from '../firebase/firebaseApp';
import { useAppDispatch } from '../redux/hooks';
import {
  setHasChangeQnRequest,
  setIsQueuing,
  setQnsId,
  setSessionId,
} from '../redux/matchSlice';
import useAuth from './auth';

const useMessageQueue = function () {
  const history = useHistory();
  const authContext = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = authContext?.user;
    if (user == null) {
      return;
    }

    const uid = user.uid;
    const userRef = firebaseApp.database().ref(`users/${uid}`);
    userRef.on('value', (snapshot) => {
      if (snapshot.val() == null) {
        return;
      }

      const notifKeys = Object.keys(snapshot.val());

      const latestNotifKey = notifKeys[notifKeys.length - 1];
      console.log(
        'notifKey: ',
        latestNotifKey,
        ' corresponding notif: ',
        snapshot.val()[latestNotifKey]
      );

      const latestNotif: Types.MessageQueueNotif =
        snapshot.val()[latestNotifKey];
      console.log('latestNotif: ', latestNotif);
      const data = latestNotif.data;

      switch (latestNotif.type) {
        case 'FOUND_SESSION':
          console.log('found session block: ', latestNotif);
          dispatch(setIsQueuing(false));
          dispatch(setSessionId(data.sessId));
          dispatch(setQnsId(data.qnsId));
          dispatch(setHasChangeQnRequest(false));
          history.replace('/collaborate');
          break;
        case 'NO_MATCH_FOUND':
        case 'STOP_SESSION':
          console.log(latestNotif);
          dispatch(setIsQueuing(false));
          dispatch(setSessionId(null));
          dispatch(setQnsId(null));
          dispatch(setHasChangeQnRequest(false));
          history.replace('/');
          break;
        case 'CHANGE_QUESTION_REQUEST':
          console.log('Change question request: ', latestNotif);
          dispatch(setHasChangeQnRequest(true));
          break;
        default:
          break;
      }

      const latestMessageRef = firebaseApp
        .database()
        .ref(`users/${uid}/${latestNotifKey}`);

      latestMessageRef
        .remove()
        .then(() => {
          console.log(
            'Latest message removed: ',
            snapshot.val()[latestNotifKey]
          );
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [authContext?.user, dispatch, history]);
};

export default useMessageQueue;
