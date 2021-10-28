import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

import useAuth from '../hooks/auth';
import useMessageQueue from '../hooks/messageQueue';

// A wrapper for <Route> that redirects to the signin screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = function (props) {
  const { children, location, ...rest } = props;
  const auth = useAuth();

  useMessageQueue();

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
