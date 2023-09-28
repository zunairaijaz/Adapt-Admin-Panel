import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import LogsTable from './LogsTable';
import '../style/icons.css';

function Logs() {
  return (
    <div className="App">
      <Header /> {/* Include the Header component */}
      <SideBar /> {/* Include the SideBar component */}
      <LogsTable />  
    </div>
  );
}

export default Logs;
