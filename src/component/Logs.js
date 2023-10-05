import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import LogsTable from './LogsTable';
import '../style/icons.css';

function Logs({ sidebarVisible }) {
  return (
    <div className={`App ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
    <LogsTable sidebarVisible={sidebarVisible}/>
    </div>
   
  );
}

export default Logs;
