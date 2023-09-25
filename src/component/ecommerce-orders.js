import React from 'react';
import '../style/app.css';
import '../style/pace.min.css';
import '../style/bootstrap.min.css';
import '../style/bootstrap-extended.css';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import OrderTable from '../component/OrdersTable';
import '../style/icons.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Orders() {
  return (
    <div className="App">
      <Header /> {/* Include the Header component */}
      <SideBar /> {/* Include the SideBar component */}
    <OrderTable/>
    </div>
  );
}

export default Orders;
