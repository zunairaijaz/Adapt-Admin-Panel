import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from './SideBar';
import Header from './Header';
import NewsTable from './NewsTable';
import '../style/icons.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function News() {
  return (
    <div className="App">
      <Header /> {/* Include the Header component */}
      <SideBar /> {/* Include the SideBar component */}
    <NewsTable/>
    </div>
  );
}

export default News;
