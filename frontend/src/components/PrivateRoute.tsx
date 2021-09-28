import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';

import useAuth from '../hooks/auth';

// A wrapper for <Route> that redirects to the signin screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = function (props) {
  const { children, ...rest } = props;
  const auth = useAuth();
  const location = useLocation();

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
