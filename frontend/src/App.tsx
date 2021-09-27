import './App.less';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App: React.FC = function () {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div>Home</div>
        </Route>
        <Route path="/login">
          <div>Login</div>
        </Route>
        <Route path="/signup">
          <div>Signup</div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
