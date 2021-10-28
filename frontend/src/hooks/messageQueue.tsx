import { useEffect } from 'react';
import { useHistory } from 'react-router';

import firebaseApp from '../firebase/firebaseApp';
import { useAppDispatch } from '../redux/hooks';
import { setIsQueuing, setSessionId } from '../redux/matchSlice';
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
      // console.log(`Processing msg with type ${msg.type}`);
      console.log(msg);

      switch (msg.type) {
        case 'FOUND_SESSION':
          dispatch(setIsQueuing(false));
          dispatch(setSessionId(data.sessId));
          dispatch(setQnsId(data.qnsId));
          history.replace('/collaborate');
          break;
        case 'NO_MATCH_FOUND':
        case 'STOP_SESSION':
          dispatch(setIsQueuing(false));
          dispatch(setSessionId(null));
          dispatch(setQnsId(null));
          history.replace('/');
          break;
        case 'CHANGE_QUESTION_REQUEST':
          dispatch(setHasChangeQnRequest(true));
          break;
        default:
          break;
      }

      msgSnapshot.ref.remove();

      // if (snapshot.val() == null) {
      //   return;
      // }

      // const notifications: Types.MessageQueueNotif[] = Object.values(
      //   snapshot.val()
      // );

      // snapshot.forEach((child_added) => {
      //   // Ordered from earliest to latest
      //   const msg: Types.MessageQueueNotif = msgSnap.val();
      //   console.log(`Processing msg with type ${msg.type}`);

      //   // switch (msg.type) {
      //   //   // case 'FOUND_SESSION':
      //   //     // console.log("Received Found session");
      //   //     // break;
      //   //   default:
      //   //     console.log(``)
      //   // }

      //   msgSnap.ref.remove();

      //   console.log(msgSnap);
      // });

      // const latestNotif: Types.MessageQueueNotif =
      //   notifications[notifications.length - 1];
      // const data = latestNotif.data;

      // if (latestNotif.type === 'FOUND_SESSION') {
      //   dispatch(setIsQueuing(false));
      //   dispatch(setSessionId(data.sessId));
      //   history.replace('/collaborate');
      // } else if (latestNotif.type === 'CANNOT_FIND_SESSION') {
      //   dispatch(setIsQueuing(false));
      //   history.replace('/');
      // }
    });

    console.log('Attached to message queue');
  }, [authContext?.user, dispatch, history]);
};

export default useMessageQueue;
