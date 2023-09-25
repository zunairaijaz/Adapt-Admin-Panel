import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// Import your Sidebar component
import Orders from './component/ecommerce-orders'; // Import your News component
import Fullcalender from './component/app-fullcalender'; // Import your Time component
import FAQ from './component/faq'; // Import your FAQ component

import Signin  from './component/Auth/auth-basic-signin';
import Signout  from './component/Auth/Signout';

import Forgotpass from './component/Auth/auth-basic-forgot-password';
 import Resetpass from './component/Auth/auth-basic-reset-password';
function App() {
  return (
    <Router basename="/">
      <div className="App">
       {/* This component will always be visible */}
        <Switch>
        <Route exact path="/"   component={ Signin} />
        <Route exact path="/forgotpass"   component={Forgotpass} /> 
        <Route exact path="/signout"   component={Signout} />

        <Route exact path="/resetpass"   component={Resetpass} />  

          <Route exact path="/news"  component={Orders} />
          <Route exact path="/time"  component={Fullcalender} />
          <Route exact path="/faq"  component={FAQ} />
          {/* Add more routes if needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
