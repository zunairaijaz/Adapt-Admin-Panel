import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import config from '../config';
import '../style/app.css';
import GuiLoader from './GuiLoader'; // Import the GuiLoader component

function GuiTable({ sidebarVisible }) {
  const [logData, setLogData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('All Fields');
  const [selectedDate, setSelectedDate] = useState(null);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [newSearchTermCompany, setNewSearchTermCompany] = useState('');
  const [employeeIdFilter, setEmployeeIdFilter] = useState('');
  const newSearchTermLowerCase = newSearchTerm;
  const newSearchTermCompanyLowerCase = newSearchTermCompany;
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
  const [loading, setLoading] = useState(true); // Loading state

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setLoading(true); // Set loading to true initially
    // Fetch data from the API when the component mounts
    axios
      .get(`${config.SERVER_URL}/get_logger_gui`)
      .then((response) => {
        setLogData(response.data.array);
        setLoading(false); // Set loading to false when data is fetched
        console.log(response);
      })
      .catch((error) => {
        setLoading(false); // Set loading to false on error
        console.log(error);
      });
  }, []);

  const filterData = (data) => {
    if (!Array.isArray(data)) {
      // Handle the case where data is not an array
      return [];
    }

    return data.filter((log) => {
      const level = (log[0] || '').toLowerCase(); // Convert level to lowercase
      const logDate = new Date(log[1]);
      const apiRequest = (log[2] || '').toLowerCase(); // Convert apiRequest to lowercase
      const apiResponse = (log[3] || '').toLowerCase(); // Convert apiResponse to lowercase
      const co2Request = (log[4] || '').toLowerCase(); // Convert co2Request to lowercase
      const co2Response = (log[5] || '').toLowerCase(); // Convert co2Response to lowercase
      const adaptRequest = (log[6] || '').toLowerCase(); // Convert adaptRequest to lowercase
      const adaptResponse = (log[7] || '').toLowerCase();

      const selectedDateStart = new Date(selectedDate);
      selectedDateStart.setHours(0, 0, 0, 0);
      const selectedDateEnd = new Date(selectedDate);
      selectedDateEnd.setHours(23, 59, 59, 999);
      const dateMatches =
        !selectedDate || (logDate >= selectedDateStart && logDate <= selectedDateEnd);

      // Check if the search term matches the employee ID or company code
      const employeeIdMatch = apiRequest?.includes(newSearchTermLowerCase);
      const companyCodeMatch = apiResponse?.includes(newSearchTermCompanyLowerCase);

      return (
        (searchField === 'All Fields' ||
          (searchField === 'Level' && level.includes(searchTerm)) ||
          (searchField === 'Date' && dateMatches) ||
          (searchField === 'Api Request' && apiRequest?.includes(searchTerm)) ||
          (searchField === 'Api Response' && apiResponse?.includes(searchTerm)) ||
          (searchField === 'Co2 Request' && co2Request?.includes(searchTerm)) ||
          (searchField === 'Co2 Response' && co2Response?.includes(searchTerm)) ||
          (searchField === 'Adapt Request' && adaptRequest?.includes(searchTerm)) ||
          (searchField === 'Adapt Response' && adaptResponse?.includes(searchTerm))) &&
        (newSearchTerm === '' || employeeIdMatch) && // Check if employee ID matches
        (newSearchTermCompany === '' || companyCodeMatch) && // Check if company code matches
        dateMatches
      );

    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNewSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Convert the search term to lowercase
    setNewSearchTerm(searchTerm);
  };
  
  const handleNew1SearchChange = (event) => {
    const searchTermCompany = event.target.value.toLowerCase(); // Convert the search term to lowercase
    setNewSearchTermCompany(searchTermCompany);
  };
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
  };

  const handleRowClick = (index) => {
    if (index === expandedRowIndex) {
      // If the clicked row is already expanded, collapse it
      setExpandedRowIndex(-1);
    } else {
      // Expand the clicked row
      setExpandedRowIndex(index);
    }
  };

  const filteredData = filterData(logData).reverse(); // Reverse the order

  // Apply a CSS class conditionally based on sidebar visibility

  return (
    <div className="App">
      <div className={`page-wrapper `}>
        <div className={`page-content ${sidebarVisible ? 'content-moved-left1' : 'content-moved-right1'}`}>
          <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '0px' }}>Logger Gui</h1>
          <hr style={{ borderTop: '2px solid #333', marginLeft: sidebarVisible ? '0' : '0px' }} />
          <div className={` mt-3`}>
            <div className="row justify-content-center">
              <div className="col-lg-15">
                <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                  <label htmlFor="search" style={{ marginRight: '10px' }}>
                    Search:{' '}
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search "
                    className="form-control"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ width: '150px' }}
                  />
                  <FormControl style={{ marginLeft: '3px', width: '120px' }}>
                    <Select
                      value={searchField}
                      onChange={handleSearchFieldChange}
                      label="Search Field"
                      style={{ height: '37px' }}
                    >
                      <MenuItem value="All Fields">All Fields</MenuItem>
                      <MenuItem value="Level">Level</MenuItem>
                      <MenuItem value="Date">Date</MenuItem>
                      <MenuItem value="Api Request">Api Request</MenuItem>
                      <MenuItem value="Api Response">Api Response</MenuItem>
                      <MenuItem value="Co2 Response">Co2 Response</MenuItem>
                      <MenuItem value="Adapt Request">Adapt Request</MenuItem>
                      <MenuItem value="Adapt Response">Adapt Response</MenuItem>
                    </Select>
                  </FormControl>
                  <div
                    style={{ marginLeft: '3px', width: '180px', backgroundColor: 'white !important' }}
                  >
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => handleDateChange(date)}
                      placeholderText="Select Date"
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div style={{ marginLeft: '3px' }}>
                    <input
                      type="text"
                      id="newSearch"
                      placeholder="Enter Employee Id"
                      className="form-control"
                      value={newSearchTerm}
                      onChange={handleNewSearchChange}
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div style={{ marginLeft: '3px' }}>
                    <input
                      type="text"
                      id="newSearchCompany"
                      placeholder="Enter Company Code"
                      className="form-control"
                      value={newSearchTermCompany}
                      onChange={handleNew1SearchChange}
                      style={{ width: '180px' }}
                    />
                  </div>
                </div>
                <div className="card-body">
                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <table className={`table mb-0`}>
                      <thead className="table-light">
                        <tr>
                          <th>Level</th>
                          <th>Date</th>
                          <th>Api Request</th>
                          <th>Api Response</th>
                          <th>Co2 Request</th>
                          <th>Co2 Response</th>
                          <th>Adapt Request</th>
                          <th>Adapt Response</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
  loading ? (
    <GuiLoader rowsNum={10} />
  ) : filteredData.length > 0 ? (
    filteredData.map((logData, index) => {
      const level = (logData[0] || '').trim().toLowerCase(); // Use trim to remove leading/trailing spaces

      // Define CSS classes based on the "Level"
      console.log("lev:::::::::",level);
     // const rowClass = level === 'error' ? 'error-row' : level === 'info' ? 'info-row' : '';
      const backgroundColor = level === 'error' ? 'tomato': level === 'info' ? '#E8E8E8' : 'transparent';

     // console.log("rowclass",rowClass);

      return (
        <tr
          key={index}
          onClick={() => handleRowClick(index)}
         // className={rowClass}
          style={{
            height: expandedRowIndex === index ? 'auto' : '50px',
            whiteSpace: expandedRowIndex === index ? 'break-spaces' : 'nowrap',
            textOverflow: expandedRowIndex === index ? 'inherit' : 'ellipsis',
            wordBreak: expandedRowIndex === index ? 'break-all' : 'inherit',
          }}
        >
          <td title={logData[0]}
           style={{ columnWidth: '50px', 
           whiteSpace: 'nowrap', 
           backgroundColor,

            }}
            >
            {logData[0]}
          </td>
          <td
            title={logData[1]}
            style={{
              columnWidth: '200px',
              whiteSpace: 'nowrap',
              backgroundColor,

              //overflow: expandedRowIndex === index ? 'auto' : 'hidden',
            }}
          >
            {logData[1]}
          </td>
          <td
            title={logData[2]}
            style={{
              columnWidth: '352px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[2]}
          </td>
          <td
            title={logData[3]}
            style={{
              columnWidth: '300px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[3]}
          </td>
          <td
            title={logData[4]}
            style={{
              columnWidth: '300px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[4]}
          </td>
          <td
            title={logData[5]}
            style={{
              columnWidth: '300px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[5]}
          </td>
          <td
            title={logData[6]}
            style={{
              columnWidth: '200px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[6]}
          </td>
          <td
            title={logData[7]}
            style={{
              columnWidth: '300px',
              overflow: expandedRowIndex === index ? 'auto' : 'hidden',
              backgroundColor,
            }}
          >
            {logData[7]}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="20" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block' }}>
          <p>No Data available.</p>
        </div>
      </td>
    </tr>
  )
}
            
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuiTable;
