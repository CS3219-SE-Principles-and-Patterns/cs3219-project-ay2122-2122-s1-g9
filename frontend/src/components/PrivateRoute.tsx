import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, useHistory } from 'react-router';

import { getCurrentSessionId, getSession } from '../firebase/functions';
import useAuth from '../hooks/auth';
import useMessageQueue from '../hooks/messageQueue';
import usePresence from '../hooks/presence';
import { useAppDispatch } from '../redux/hooks';
import { setIsQueuing, setQnsId, setSessionId } from '../redux/matchSlice';

// A wrapper for <Route> that redirects to the signin screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = function (props) {
  const { children, location, ...rest } = props;

  useMessageQueue();
  usePresence();
  const auth = useAuth();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (auth?.user == null) {
      setIsLoading(false);
      return;
    }

    getCurrentSessionId().then((res) => {
      const sessId = res.data.sessId;

      if (!sessId) {
        setIsLoading(false);
        return;
      }

      getSession({ sessId }).then((res) => {
        // Only replace history when we have all the data we need
        dispatch(setSessionId(sessId));
        dispatch(setQnsId(res.data.qnsId));
        dispatch(setIsQueuing(false));
        setIsLoading(false);
        history.replace('/collaborate');
      });
    });
  }, [auth?.user, history, dispatch]);

  if (isLoading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <Route {...rest}>
      {auth?.user ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: location },
          }}
        />
      )}
    </Route>
  );
};

export default PrivateRoute;
