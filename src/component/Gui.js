import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import GuiTable from './GuiTable';
import '../style/icons.css';

function Gui() {
  return (
    <div className="App">
      <Header /> {/* Include the Header component */}
      <SideBar /> {/* Include the SideBar component */}
      <GuiTable />  
    </div>
  );
}

export default Gui;
