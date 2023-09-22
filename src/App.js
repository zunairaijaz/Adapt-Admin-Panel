import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Import your Sidebar component
import orders from './component/ecommerce-orders'; // Import your News component
import fullcalender from './component/app-fullcalender'; // Import your Time component
import FAQ from './component/faq'; // Import your FAQ component

import Signin  from './component/Auth/auth-basic-signin';
import Signout  from './component/Auth/Signout';

import forgotpass from './component/Auth/auth-basic-forgot-password';
 import resetpass from './component/Auth/auth-basic-reset-password';
function App() {
  return (
    <Router>
      <div className="App">
       {/* This component will always be visible */}
        <Switch>
        <Route path="/signin" component={Signin} />
        <Route path="/forgotpass" component={forgotpass} /> 
        <Route path="/signout" component={Signout} />

        <Route path="/resetpass" component={resetpass} />  

          <Route path="/news" component={orders} />
          <Route path="/time" component={fullcalender} />
          <Route path="/faq" component={FAQ} />
          {/* Add more routes if needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
