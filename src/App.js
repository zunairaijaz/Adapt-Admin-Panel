// App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Time from './component/Time';
import SignIn from './component/Auth/SignIn';
import ForgotPassword from './component/Auth/ForgotPassword';
import ResetPassword from './component/Auth/ResetPassword';
import SideBar from './component/SideBar';
import Header from './component/Header';
import NewsTable from './component/NewsTable';
import GuiTable from './component/GuiTable';
import FaqTable from './component/FaqTable';
import LogsTable from './component/LogsTable';
import GuiTableDatabase from './component/GuiTableDatabase';
import SignOut from './component/Auth/Signout';

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

    // Add event listener to handle window resize
    const handleResize = () => {
      // Close the sidebar if the window width is below a certain threshold (e.g., 768 pixels)
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <SignIn />
          </Route>
          <Route exact path="/forgotpass">
            <ForgotPassword />
          </Route>
          <Route exact path="/resetpass">
            <ResetPassword />
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
                onLinkClick={() => setSidebarVisible(false)} // Close sidebar on link click
              />

              <Route exact path="/news">
                <NewsTable sidebarVisible={sidebarVisible} />
              </Route>
              <Route exact path="/time">
                <Time sidebarVisible={sidebarVisible} />
              </Route>
              <Route exact path="/faq">
                <FaqTable sidebarVisible={sidebarVisible} />
              </Route>
              <Route exact path="/logs">
                <LogsTable sidebarVisible={sidebarVisible} />
              </Route>
              <Route exact path="/gui">
                <GuiTable sidebarVisible={sidebarVisible} />
              </Route>
              <Route exact path="/guidb">
                <GuiTableDatabase sidebarVisible={sidebarVisible} />
              </Route>
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
