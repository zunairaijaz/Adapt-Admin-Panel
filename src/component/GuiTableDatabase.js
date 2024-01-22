import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import config from '../config';
import '../style/app.css';
import GuiLoader from './GuiLoader'; // Import the GuiLoader component
function GuiTableDatabase({ sidebarVisible }) {
  const [logData, setLogData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('All Fields');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [newSearchTermCompany, setNewSearchTermCompany] = useState('');
  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
  const [loading, setLoading] = useState(true); // Loading state
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(1);
  const [expandedRowIndices, setExpandedRowIndices] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date?.toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' });
    setCurrentPage(1);
    fetchData(1, itemsPerPage, searchTerm, searchField, formattedDate, newSearchTerm, newSearchTermCompany);
  };


  useEffect(() => {
    fetchData(currentPage, itemsPerPage, searchTerm, searchField, selectedDate, newSearchTerm, newSearchTermCompany);
  }, [itemsPerPage]);

  const fetchData = (page, perPage, search, searchField, selectedDate, newSearchTerm, newSearchTermCompany) => {
    setLoading(true); // Set loading to true initiall
    const requestBody = {
      page,
      perPage,
      search,
      condition: searchField,
      date: selectedDate,
      employeeId: newSearchTerm,
      companyId: newSearchTermCompany
    }
    axios
      .post(`${config.NEW_SERVER_URL}/get_database_logs_gui`, requestBody)
      .then((response) => {
        const fetchedData = response.data.logs;
        setLogData(fetchedData);
        setTotalPages(Math.ceil(response.data.totalPages));
        setTotalLogs(Math.ceil(response.data.totalRecords));
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        setLoading(false); // Set loading to false on error
        toast.error('Error fetching data: ' + error.message);
        console.log(error);
      });
  };

  const handleMainLogPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const formattedDate = selectedDate?.toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' });

      setCurrentPage(newPage);
      fetchData(newPage, itemsPerPage, searchTerm, searchField, formattedDate, newSearchTerm, newSearchTermCompany);
    }
  };
  const handleMainLogItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    const formattedDate = selectedDate?.toLocaleDateString('en-US', { timeZone: 'Asia/Karachi' });
    setCurrentPage(1);
    // Fetch data with the current selected device ID and current page
    fetchData(1, newItemsPerPage, searchTerm, searchField, formattedDate, newSearchTerm, newSearchTermCompany);
  };

  function formatDateTime(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const handleRowClick = (index) => {
    const updatedExpandedRowIndices = [...expandedRowIndices];

    if (updatedExpandedRowIndices.includes(index)) {
      // Double-click on an expanded row: collapse it
      const indexOfExpandedRow = updatedExpandedRowIndices.indexOf(index);
      updatedExpandedRowIndices.splice(indexOfExpandedRow, 1);
    } else {
      // Double-click on a non-expanded row: expand it
      updatedExpandedRowIndices.push(index);
    }

    setExpandedRowIndices(updatedExpandedRowIndices);
  };


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageCount = 3; // Number of visible page numbers

    const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
    const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

    const selectedButtonStyle = {
      background: 'black',
      // border: '1px solid lightgrey',
      color: 'white',
      marginRight: '3px',
    };

    const buttonStyle = {
      background: 'transparent',
      border: '1px solid lightgrey',
      marginRight: '3px'
    };


    if (currentPage > 1) {
      pageNumbers.push(
        <Button title={"Start"}
          key="first"
          variant=""
          size="sm"
          style={buttonStyle}
          onClick={() => handleMainLogPageChange(1)}
        >
          {"<<"}
        </Button>
      );
    }
    if (currentPage > 1) {
      pageNumbers.push(
        <Button title={"Previous"}
          key="previous"
          variant=""
          size="sm"
          style={buttonStyle}
          onClick={() => handleMainLogPageChange(currentPage - 1)}
        >
          {"<"}
        </Button>
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === currentPage;
      pageNumbers.push(
        <Button
          key={i}
          variant=""
          size="sm"
          style={isCurrentPage ? selectedButtonStyle : buttonStyle}
          onClick={() => handleMainLogPageChange(i)}
          disabled={currentPage === i}
        >
          {i}
        </Button>
      );
    }
    if (currentPage < totalPages) {
      pageNumbers.push(
        <Button title={"Next"}
          key="next"
          variant=""
          size="sm" // Add this style to make the icons smaller
          style={buttonStyle}
          onClick={() => handleMainLogPageChange(currentPage + 1)}
        >
          {">"}
        </Button>
      );
    }
    if (currentPage < totalPages - 1) {
      pageNumbers.push(
        <Button title={"End"}
          key="last"
          variant=""
          size="sm"
          style={buttonStyle}
          onClick={() => handleMainLogPageChange(totalPages)}
        >
          {">>"}
        </Button>
      );
    }


    return pageNumbers;
  };
  const getRangeLabel = () => {
    if (totalLogs === 0) {
      return '0 logs';
    }

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalLogs);
    const total = totalLogs;

    return `${start} - ${end} / ${total} logs`;
  };
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
    fetchData(currentPage, itemsPerPage, searchTerm, event.target.value, selectedDate, newSearchTerm, newSearchTermCompany);

  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    fetchData(currentPage, itemsPerPage, event.target.value, searchField, selectedDate, newSearchTerm, newSearchTermCompany)
  };
  const handleNewSearchChange = (event) => {
    setNewSearchTerm(event.target.value);
    fetchData(currentPage, itemsPerPage, searchTerm, searchField, selectedDate, event.target.value, newSearchTermCompany)
  };
  const handleNew1SearchChange = (event) => {
    const newSearchTermCompany = event.target.value // Convert the search term to lowercase
    setNewSearchTermCompany(newSearchTermCompany);
    fetchData(currentPage, itemsPerPage, searchTerm, searchField, selectedDate, newSearchTerm, event.target.value)
  };

  return (
    <div className="App">
      <div className={`page-wrapper `}>
        <div className={`page-content ${sidebarVisible ? 'content-moved-left1' : 'content-moved-right1'}`}>
          <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '0px' }}>Transaction Logs</h1>
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    id="search"
                    placeholder="Search "
                    className="form-control"
                    style={{ width: '150px' }}
                  />
                  <FormControl style={{ marginLeft: '3px', width: '120px' }}>
                    <Select
                      value={searchField}
                      label="Search Field"
                      onChange={handleSearchFieldChange}
                      style={{ height: '37px' }}
                    >
                      <MenuItem value="All Fields">All Fields</MenuItem>
                      <MenuItem value="Level">Level</MenuItem>
                      <MenuItem value="Api Request">Api Request</MenuItem>
                      <MenuItem value="Api Response">Api Response</MenuItem>
                      <MenuItem value="Co2 Request">Co2 Request</MenuItem>
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
                      value={newSearchTerm}
                      onChange={handleNewSearchChange}
                      className="form-control"
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div style={{ marginLeft: '3px' }}>
                    <input
                      type="text"
                      id="newSearchCompany"
                      placeholder="Enter Company Code"
                      value={newSearchTermCompany}
                      onChange={handleNew1SearchChange}
                      className="form-control"
                      style={{ width: '180px' }}
                    />
                  </div>
                  <div style={{ margin: '3px' }}>
                    <FormControl variant="outlined" style={{ height: '37px', width: '200px' }}>
                      <InputLabel>Logs per Page</InputLabel>
                      <Select
                        value={itemsPerPage}
                        onChange={(e) => handleMainLogItemsPerPageChange(e.target.value)}
                        style={{ height: 38 }}
                        label="Logs per Page"

                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
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
                          ) : logData.length > 0 ? (
                            logData.map((logData, index) => {
                              // const rowClass = level === 'error' ? 'error-row' : level === 'info' ? 'info-row' : '';
                              const backgroundColor = logData.level === 'error' ? '#dc3545' : logData.level === 'info' ? '#E8E8E8' : 'transparent';

                              // console.log("rowclass",rowClass);

                              return (
                                <tr
                                  key={index}
                                  onDoubleClick={() => handleRowClick(index)}
                                  // className={rowClass}
                                  style={{
                                    height: expandedRowIndices.includes(index) ? 'auto' : '50px',
                                    whiteSpace: expandedRowIndices.includes(index) ? 'break-spaces' : 'nowrap',
                                    textOverflow: expandedRowIndices.includes(index) ? 'inherit' : 'ellipsis',
                                    wordBreak: expandedRowIndices.includes(index) ? 'break-all' : 'inherit',
                                  }}
                                >
                                  <td title={logData.level}
                                    style={{
                                      columnWidth: '50px',
                                      whiteSpace: 'nowrap',
                                      backgroundColor,

                                    }}
                                  >
                                    {logData.level}
                                  </td>
                                  <td
                                    title={formatDateTime(logData.date)}
                                    style={{
                                      columnWidth: '200px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {formatDateTime(logData.date)}
                                  </td>
                                  <td
                                    title={logData.apiRequest}
                                    style={{
                                      columnWidth: '352px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.apiRequest)}
                                  </td>
                                  <td
                                    title={logData.apiResponse}
                                    style={{
                                      columnWidth: '300px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.apiResponse)}
                                  </td>
                                  <td
                                    title={logData.co2Request}
                                    style={{
                                      columnWidth: '300px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.co2Request)}
                                  </td>
                                  <td
                                    title={logData.co2Response}
                                    style={{
                                      columnWidth: '300px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.co2Response)}
                                  </td>
                                  <td
                                    title={logData.adaptRequest}
                                    style={{
                                      columnWidth: '200px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.adaptRequest)}
                                  </td>
                                  <td
                                    title={logData.adaptResponse}
                                    style={{
                                      columnWidth: '300px',
                                      overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                      backgroundColor,
                                    }}
                                  >
                                    {JSON.stringify(logData.adaptResponse)}
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
      <div className="table-pagination">
        <div className="pagination float-right" style={{ marginBottom: '40px', marginRight: '60px' }}>
          {renderPageNumbers()}
        </div>
      </div>
      <label
        variant=""
        size='sm'
        style={{
          marginLeft: sidebarVisible ? '300px' : '130px', // Conditionally set marginLeft
          marginBottom: '80px',
          background: 'rgba(0, 0, 0, 0.7)', // Light black with 40% opacity
          color: 'white',
          borderRadius: '2px',
          height: '28px',
          width: '180px',
          textAlign: 'center'
        }}
      >
        <p>{getRangeLabel()}</p>
      </label>
      <ToastContainer />
    </div>

  );
}


export default GuiTableDatabase;