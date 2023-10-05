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
import Gui from './Gui';

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios
      .get(`${config.SERVER_URL}/get_logger_gui`)
      .then((response) => {
        setLogData(response.data.array);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const filterData = (data) => {
    if (!Array.isArray(data)) {
      // Handle the case where data is not an array
      return [];
    }

    return data.filter((log) => {
      const level = (log[0] || '').toLowerCase();
      const logDate = new Date(log[1]);
      const apiRequest = log[2];
      const apiResponse = log[3];
      const co2Request = log[4];
      const co2Response = log[5];
      const adaptRequest = log[6];
      const adaptResponse = log[7];

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
    setNewSearchTerm(event.target.value);
  };

  const handleNew1SearchChange = (event) => {
    setNewSearchTermCompany(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
  };

  const filteredData = filterData(logData);

  // Apply a CSS class conditionally based on sidebar visibility

  return (
    <div className="App">
      <div className={`page-wrapper `}>
      <div className={`page-content ${sidebarVisible ? 'content-moved-left' : 'content-moved-right'}`}>
      <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '70px' }}>Logger Gui</h1>
          <hr style={{ borderTop: '2px solid #333',marginLeft: sidebarVisible ? '0' : '70px' }} />
          <div className={`container mt-3`}>
            <div className="row justify-content-center">
              <div className="col-lg-11">
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
                  <div className="table-responsive">
                    {filteredData.length > 0 ? (
                      <table className={`table mb-0 ${sidebarVisible ? '' : 'content-moved-right'}`}>
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
                          {filteredData.map((logData, index) => (
                            <tr key={index}>
                              <td>{logData[0]} </td>
                              <td>{logData[1]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[2]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[3]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[4]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[5]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[6]}</td>
                              <td style={{ whiteSpace: 'normal' }}>{logData[7]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div>Loading data...</div>
                    )}
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
