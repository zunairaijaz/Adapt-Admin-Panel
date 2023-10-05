import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import config from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '../style/app.css';
import { useHistory } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function LogsTable({ sidebarVisible }) {
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [deviceIds, setDeviceIds] = useState([]);
    const [selectedDeviceLogData, setSelectedDeviceLogData] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(-1);

    const history = useHistory();

    useEffect(() => {
        fetchData(); // Fetch the log data
        fetchDeviceIds(); // Fetch the device IDs
    }, []);

    const fetchData = () => {
        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getVehicleLogData`,
        })
            .then((response) => {
                if (response.data) {
                    console.log(response);
                    setLogData(response.data);
                    //toast.success('Data fetched successfully!');
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data: ' + error.message);
            });
    };
    const fetchDataById = (deviceId) => {
        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getVehicleLogDataById/${deviceId}`,
        })
            .then((response) => {
                if (response.data) {
                    console.log(response);
                    setSelectedDeviceLogData(response.data);
                    //toast.success('Data fetched successfully!');
                }
            })
            .catch((error) => {
                console.error('Error fetching data by device ID:', error);
                toast.error('Error fetching data: ' + error.message);
            });
    };
    const fetchDeviceIds = () => {
        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getUniqueDeviceIds`,
        })
            .then((response) => {
                if (Array.isArray(response.data.deviceIds)) {
                    setDeviceIds(response.data.deviceIds); // Set the fetched device IDs in state
                } else {
                    console.error('Device IDs data is not an array:', response.data.deviceIds);
                    setDeviceIds([]); // Initialize as an empty array
                }
            })
            .catch((error) => {
                console.error('Error fetching device IDs:', error);
                setDeviceIds([]); // Initialize as an empty array
            });
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = logData.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(logData.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };
    const handleDeviceIdChange = (newDeviceId) => {
        if (newDeviceId === "") {
            // When "All Devices" is selected, fetch all data
            setSelectedDeviceId(""); // Set the selectedDeviceId to an empty string
            fetchData();
        } else {
            // When a specific device ID is selected, fetch data by ID
            setSelectedDeviceId(newDeviceId);
            fetchDataById(newDeviceId);
        }
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
    return (
        <div className="App">
            <div className="page-wrapper">
                <div className={`page-content ${sidebarVisible ? 'content-moved-left' : 'content-moved-right'}`}>
                    <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '30px' }}>App Logs</h1>
                    <hr style={{ borderTop: '2px solid #333', marginLeft: sidebarVisible ? '0' : '30px' }} />
                    <div className="container mt-3">
                        <div className="row justify-content-center">
                            <div className="col-lg-15">
                                <FormControl variant="outlined" style={{ marginBottom: '20px', width: '200px' }}>
                                    <InputLabel>{selectedDeviceId === "" ? "All Devices" : "Device Id"}</InputLabel>
                                    <Select
                                        value={selectedDeviceId}
                                        onChange={(e) => handleDeviceIdChange(e.target.value)}
                                        label={selectedDeviceId === "" ? "All Devices" : "DeviceId"}
                                    >
                                        <MenuItem value="">All Devices</MenuItem>
                                        {deviceIds.map((deviceId) => (
                                            <MenuItem key={deviceId} value={deviceId}>
                                                {deviceId}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>deviceId</th>
                                                    <th>DateTime</th>
                                                    <th>Log String</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedDeviceId !== ''
                                                    ? selectedDeviceLogData.map((log, index) => (
                                                        <tr
                                                            key={index}
                                                            onClick={() => handleRowClick(index)}
                                                            style={{
                                                                height: expandedRowIndex === index ? 'auto' : '50px',
                                                                whiteSpace: expandedRowIndex === index ? 'break-spaces' : 'nowrap',
                                                                textOverflow: expandedRowIndex === index ? 'inherit' : 'ellipsis',
                                                            }}
                                                        >
                                                            <td title={log.deviceId}
                                                                style={{
                                                                    columnWidth: '350px',
                                                                    overflow: expandedRowIndex === index ? 'auto' : 'hidden ',
                                                                    paddingRight: '20px'
                                                                }}
                                                            >
                                                                {log.deviceId}
                                                            </td>
                                                            <td  title={log.dateTime}
                                                                style={{
                                                                    columnWidth: '300px',
                                                                    overflow: expandedRowIndex === index ? 'auto' : 'hidden ',
                                                                    paddingRight: '10px'
                                                                }}
                                                            >
                                                                {log.dateTime}
                                                            </td>
                                                            <td title={log.logString}
                                                                style={{
                                                                    columnWidth: '200px',
                                                                    overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                                                }}
                                                            >
                                                                {log.logString}
                                                            </td>
                                                        </tr>
                                                    ))
                                                    : currentItems.length > 0
                                                        ? currentItems.map((log, index) => (
                                                            <tr
                                                                key={index}
                                                                onClick={() => handleRowClick(index)}
                                                                style={{
                                                                    height: expandedRowIndex === index ? 'auto' : '50px',
                                                                    whiteSpace: expandedRowIndex === index ? 'break-spaces' : 'nowrap',
                                                                    textOverflow: expandedRowIndex === index ? 'inherit' : 'ellipsis',
                                                                }}
                                                            >
                                                                <td  title={log.deviceId}
                                                                    style={{
                                                                        columnWidth: ' 350px',
                                                                        overflow: expandedRowIndex === index ? 'auto' : 'hidden ',
                                                                        paddingRight: '20px'

                                                                    }}
                                                                >
                                                                    {log.deviceId}
                                                                </td>
                                                                <td  title={log.dateTime}
                                                                    style={{
                                                                        columnWidth: '300px',
                                                                        overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                                                        paddingRight: '10px'

                                                                    }}
                                                                >
                                                                    {log.dateTime}
                                                                </td>
                                                                <td  title={log.logString}
                                                                    style={{
                                                                        columnWidth: '200px',
                                                                        overflow: expandedRowIndex === index ? 'auto' : 'hidden',
                                                                    }}
                                                                >
                                                                    {log.logString}
                                                                </td>
                                                            </tr>
                                                        ))
                                                        : (
                                                            <tr>
<td colSpan="6" style={{ textAlign: 'center' }}>
                              <div style={{ display: 'inline-block' }}>
                                <p>No Data available.</p>
                              </div>
                            </td>                                                            </tr>
                                                        )}
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
                    {/* Add margin-bottom to move it up slightly */}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ marginRight: '2px' }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(logData.length / itemsPerPage)}
                        style={{ marginRight: '2px' }}
                    >
                        Next
                    </Button>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" size="sm">
                            Items per page: {itemsPerPage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(5)}>5</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(10)}>10</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleItemsPerPageChange(20)}>20</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
export default LogsTable;
