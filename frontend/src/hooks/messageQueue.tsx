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

    userRef.on('child_added', (msgSnapshot, _prevMsgSnapshot) => {
      const msg: Types.MessageQueueNotif = msgSnapshot.val();
      const data = msg.data;

      switch (msg.type) {
        case 'FOUND_SESSION':
          dispatch(setIsQueuing(false));
          dispatch(setSessionId(data.sessId));
          dispatch(setQnsId(data.qnsId));
          dispatch(setHasChangeQnRequest(false));
          history.replace('/collaborate');
          break;
        case 'NO_MATCH_FOUND':
          dispatch(setIsQueuing(false));
          history.replace('/');
          break;
        case 'STOP_SESSION':
          dispatch(setSessionId(null));
          dispatch(setQnsId(null));
          dispatch(setHasChangeQnRequest(false));
          if (!data.startNextSession) {
            history.replace('/');
          }
          break;
        case 'CHANGE_QUESTION_REQUEST':
          dispatch(setHasChangeQnRequest(true));
          break;
        default:
          console.log(`Unable to process ${msg.type}`);
          break;
      }

      msgSnapshot.ref.remove();
    });
  }, [authContext?.user, dispatch, history]);
};

export default useMessageQueue;
