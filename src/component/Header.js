import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Signout from './Auth/SignIn'; // Import the Signout component
import '../style/app.css';
function Header() {
  return (
    <div className="App">
      <header>
        <div className="topbar d-flex align-items-center">
          <nav className="navbar navbar-expand gap-3">
            <div className="collapse navbar-collapse" id="navbarNav">
            </div>
            <div className="user-box dropdown px-3">
              <a
                className="d-flex align-items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="material-icons user-icon">
                  <PersonIcon />
                </i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    to="/signout"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bx bx-log-out-circle"></i><span>Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;
