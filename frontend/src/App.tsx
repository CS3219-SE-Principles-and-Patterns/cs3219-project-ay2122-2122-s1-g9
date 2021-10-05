import './App.less';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Editor from './components/Editor';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/auth';
import Signin from './pages/Signin';

const App: React.FC = function () {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <div>Home</div>
          </PrivateRoute>
          <Route path="/signin">
            <Signin />
          </Route>
          {/* NOTE: Testing only, delete this later */}
          <Route path="/editor">
            <Editor />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
