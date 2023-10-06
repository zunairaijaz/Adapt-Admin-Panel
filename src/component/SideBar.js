import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
import DescriptionIcon from '@mui/icons-material/Description';
import GradingIcon from '@mui/icons-material/Grading';

function SideBar({ sidebarVisible, toggleSidebar, onLinkClick }) {
  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  };

  const sidebarStyle = {
    width: sidebarVisible ? '250px' : '70px',
    transition: 'width 0.3s ease-in-out',
    backgroundColor: 'black',
  };

  const logoTextStyle = {
    color: 'black', // Changed the logo text color to white
    padding: '10px',
    textAlign: 'center',
  };

  const iconActiveClass = 'icon-active'; // CSS class for active icon color
  const iconInactiveClass = 'icon-inactive'; // CSS class for inactive icon color
  const activeLinkStyle = {
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className={`App ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="wrapper">
        <div className="sidebar-wrapper" data-simplebar="true" style={sidebarStyle}>
          <div className="sidebar-header">
            <div>
              {sidebarVisible && (
                <h4 className="logo-text" style={logoTextStyle}>
                  ADAPT-ADMIN
                </h4>
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
              <NavLink
                to="/news"
                style={linkStyle}
                activeStyle={activeLinkStyle} // Apply active styles to the NavLink
                onClick={onLinkClick} // Close sidebar on link click

             >
                <div className="parent-icon">
                  <InsertPhotoIcon
                    className={activeLinkStyle.color === 'black' ? iconActiveClass : iconInactiveClass}
                  />
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  News
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/time"
                style={linkStyle}
                activeStyle={activeLinkStyle} // Apply active styles to the NavLink
                onClick={onLinkClick} // Close sidebar on link click

              >
                <div className="parent-icon">
                  <TimelineRoundedIcon
                    className={activeLinkStyle.color === 'black' ? iconActiveClass : iconInactiveClass}
                  />
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  Time
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                style={linkStyle}
                activeStyle={activeLinkStyle} // Apply active styles to the NavLink
                onClick={onLinkClick} // Close sidebar on link click

              >
                <div className="parent-icon">
                  <LiveHelpRoundedIcon
                    className={activeLinkStyle.color === 'black' ? iconActiveClass : iconInactiveClass}
                  />
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  FAQ
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logs"
                style={linkStyle}
                activeStyle={activeLinkStyle} // Apply active styles to the NavLink
                onClick={onLinkClick} // Close sidebar on link click

              >
                <div className="parent-icon">
                  <DescriptionIcon
                    className={activeLinkStyle.color === 'black' ? iconActiveClass : iconInactiveClass}
                  />
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  App Logs
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gui"
                style={linkStyle}
                activeStyle={activeLinkStyle} // Apply active styles to the NavLink
                onClick={onLinkClick} // Close sidebar on link click

              >
                <div className="parent-icon">
                  <GradingIcon
                    className={activeLinkStyle.color === 'black' ? iconActiveClass : iconInactiveClass}
                  />
                </div>
                <div className={`menu-title ${!sidebarVisible ? 'hidden' : ''}`}>
                  Logger GUI
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
