import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import News from './component/News';
import Time from './component/Time';
import FAQ from './component/Faq';
import SignIn from './component/Auth/SignIn';
import SignOut from './component/Auth/SignOut';
import ForgotPassword from './component/Auth/ForgotPassword';
import ResetPassword from './component/Auth/ResetPassword';
import Logs from './component/Logs';
import Gui from './component/Gui';
import SideBar from './component/SideBar';
import GuiTable from './component/GuiTable';
import Header from './component/Header';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [token, setToken] = useState(null);

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    // Get the token from localStorage when the component mounts
    const storedToken = localStorage.getItem('admin');
    setToken(storedToken);
  }, []);

  return (
    <Router >
      <div className="App">
        {/* Render the Header and Sidebar */}
        

        <Switch>
          <Route exact path="/">
            <Redirect to="/" /> : <SignIn />
          </Route>
          <Route exact path="/forgotpass">
           <Redirect to="/" /> : <ForgotPassword />
          </Route>
          <Route exact path="/resetpass">
           <Redirect to="/" /> : <ResetPassword />
          </Route>
          <Route exact path="/signout">
            <SignOut />
          </Route>
          {token && (
          <>
            <Header />
            <SideBar
              sidebarVisible={sidebarVisible}
              toggleSidebar={toggleSidebar}
            />
             <Route exact path="/news">
            <News sidebarVisible={sidebarVisible} />
          </Route>
          <Route exact path="/time">
            <Time sidebarVisible={sidebarVisible} />
          </Route>
          <Route exact path="/faq">
            <FAQ sidebarVisible={sidebarVisible} />
          </Route>
          <Route exact path="/logs">
            <Logs sidebarVisible={sidebarVisible} />
          </Route>
          <Route exact path="/gui">
            <Gui sidebarVisible={sidebarVisible} />
          </Route>
          </>
        )}
     
         
       
        </Switch>
      </div>
    </Router>
  );
}

export default App;
