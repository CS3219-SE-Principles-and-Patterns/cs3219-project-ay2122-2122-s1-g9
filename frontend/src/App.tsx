import './App.less';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/auth';
import Collaborate from './pages/Collaborate';
import Home from './pages/Home';
import Queue from './pages/Queue';
import Signin from './pages/Signin';

const App: React.FC = function () {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
          <PrivateRoute exact path="/queue">
            <Queue />
          </PrivateRoute>
          <Route path="/signin">
            <Signin />
          </Route>
          <PrivateRoute exact path="/collaborate">
            <Collaborate />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
