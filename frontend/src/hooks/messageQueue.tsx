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

      const notifications: Types.MessageQueueNotif[] = Object.values(
        snapshot.val()
      );
      const latestNotif: Types.MessageQueueNotif =
        notifications[notifications.length - 1];
      const data = latestNotif.data;

      if (latestNotif.type === 'FOUND_SESSION') {
        console.log('found session block: ', latestNotif);
        dispatch(setIsQueuing(false));
        dispatch(setSessionId(data.sessId));
        dispatch(setQnsId(data.qnsId));
        dispatch(setHasChangeQnRequest(false));
        history.replace('/collaborate');
      } else if (latestNotif.type === 'NO_MATCH_FOUND') {
        console.log('no match found block: ', latestNotif);
        dispatch(setIsQueuing(false));
        dispatch(setSessionId(null));
        dispatch(setQnsId(null));
        dispatch(setHasChangeQnRequest(false));
        history.replace('/');
      } else if (latestNotif.type === 'STOP_SESSION') {
        console.log('Stop session block: ', latestNotif);
        dispatch(setIsQueuing(false));
        dispatch(setSessionId(null));
        dispatch(setQnsId(null));
        dispatch(setHasChangeQnRequest(false));
        history.replace('/');
      } else if (latestNotif.type === 'CHANGE_QUESTION_REQUEST') {
        console.log('Change question request: ', latestNotif);
        dispatch(setHasChangeQnRequest(true));
      }
    });
  }, [authContext?.user, dispatch, history]);
};

export default useMessageQueue;
