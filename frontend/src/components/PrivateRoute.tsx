import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, useHistory } from 'react-router';

import { isInCurrentSession } from '../firebase/functions';
import useAuth from '../hooks/auth';

// A wrapper for <Route> that redirects to the signin screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = function (props) {
  const { children, location, ...rest } = props;
  const auth = useAuth();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (location?.pathname === '/collaborate') {
      setIsLoading(false);
      return;
    }

    isInCurrentSession().then((res) => {
      if (res.data.isInCurrentSession) {
        history.push('/collaborate');
      }
      setIsLoading(false);
    });
  }, [history, location?.pathname]);

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
