import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import News from './component/News'; // Import your News component
import Time from './component/Time'; // Import your Time component
import FAQ from './component/Faq'; // Import your FAQ component
import SignIn from './component/Auth/SignIn';
import SignOut from './component/Auth/SignOut';
import ForgotPassword from './component/Auth/ForgotPassword';
import ResetPassword from './component/Auth/ResetPassword';
import Logs from './component/Logs'; // Import your FAQ component

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Switch>
          <Route exact path="/" component={SignIn} />
          <Route exact path="/forgotpass" component={ForgotPassword} />
          <Route exact path="/signout" component={SignOut} />
          <Route exact path="/resetpass" component={ResetPassword} />
          <Route exact path="/news" component={News} />
          <Route exact path="/time" component={Time} />
          <Route exact path="/faq" component={FAQ} />
          <Route exact path="/logs" component={Logs} />
        </Switch>
      </div>
    </Router>
  );
}
export default App;
