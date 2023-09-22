import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import '../plugins/metismenu/css/metisMenu.min.css';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import TimelineRoundedIcon from '@material-ui/icons/TimelineRounded';
import LiveHelpRoundedIcon from '@material-ui/icons/LiveHelpRounded';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

function SideBar() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white', // Set text color to white
  };

  const sidebarStyle = {
    width: sidebarVisible ? '250px' : '70px',
    transition: 'width 0.3s ease-in-out',
    backgroundColor: 'black',
  };

  const logoTextStyle = {
    color: 'black', // Set text color of logo text to black
    padding: '10px', // Add padding to logo text
    textAlign: 'center', // Center align text
  };

  return (
    <div className={`App ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="wrapper">
        <div className="sidebar-wrapper" data-simplebar="true" style={sidebarStyle}>
          <div className="sidebar-header">
            <div>
              {sidebarVisible && (
                <h4 className="logo-text" style={logoTextStyle}>ADAPT-ADMIN</h4>
              )}
            </div>
            <div className="toggle-button" onClick={toggleSidebar}>
              {sidebarVisible ? (
                <ArrowBackIcon style={{ color: 'black' }} />
              ) : (
                <ArrowForwardIcon style={{ color: 'black' }} />
              )}
            </div>
          </div>

          <ul className="metismenu" id="menu">
            <li>
              <Link to="/news" style={linkStyle}>
                <div className="parent-icon">
                  <InsertPhotoIcon style={{ color: 'white' }} /> {/* Set icon color to white */}
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  News
                </div>
              </Link>
            </li>
            <li>
              <Link to="/time" style={linkStyle}>
                <div className="parent-icon">
                  <TimelineRoundedIcon style={{ color: 'white' }} /> {/* Set icon color to white */}
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  Time
                </div>
              </Link>
            </li>
            <li>
              <Link to="/faq" style={linkStyle}>
                <div className="parent-icon">
                  <LiveHelpRoundedIcon style={{ color: 'white' }} /> {/* Set icon color to white */}
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  FAQ
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
