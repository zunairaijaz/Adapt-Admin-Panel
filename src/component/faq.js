import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import FaqTable from './FaqTable';
import '../style/icons.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function FAQ({ sidebarVisible }) {
  return (
    <div className={`App ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
    <FaqTable sidebarVisible={sidebarVisible}/>
    </div>
   
  );
}

export default FAQ;
