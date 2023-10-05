import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import GuiTable from './GuiTable';
import '../style/icons.css';

function Gui({ sidebarVisible }) {
  return (
    <div className={`App ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
      <GuiTable sidebarVisible={sidebarVisible} /> {/* Pass sidebarVisible as a prop to GuiTable */}
    </div>
  );
}


export default Gui;
