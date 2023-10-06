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
import LogsLoader from './LogsLoader';

function LogsTable({ sidebarVisible }) {
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [deviceIds, setDeviceIds] = useState([]);
    const [selectedDeviceLogData, setSelectedDeviceLogData] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [selectedDeviceCurrentPage, setSelectedDeviceCurrentPage] = useState(1);
    const [selectedDeviceItemsPerPage, setSelectedDeviceItemsPerPage] = useState(10);

    const history = useHistory();

    useEffect(() => {
        fetchData();
        fetchDeviceIds();
    }, []);

    useEffect(() => {
        if (selectedDeviceId === "") {
            setSelectedDeviceLogData([]); // Reset selected device log data when no device is selected
        }
    }, [selectedDeviceId]);

    useEffect(() => {
        // Reset the current page for selected device logs when items per page changes
        setSelectedDeviceCurrentPage(1);
    }, [selectedDeviceItemsPerPage]);

    const fetchData = () => {
        setLoading(true);

        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getVehicleLogData`,
        })
            .then((response) => {
                if (response.data) {
                    console.log(response);
                    setLogData(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data: ' + error.message);
                setLoading(false);
            });
    };

    const fetchDataById = (deviceId) => {
        setLoading(true);

        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getVehicleLogDataById/${deviceId}`,
        })
            .then((response) => {
                if (response.data) {
                    console.log(response);
                    setSelectedDeviceLogData(response.data);
                    setSelectedDeviceCurrentPage(1); // Reset pagination to the first page
                }
            })
            .catch((error) => {
                console.error('Error fetching data by device ID:', error);
                toast.error('Error fetching data: ' + error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchDeviceIds = () => {
        axios({
            method: 'GET',
            url: `${config.SERVER_URL}/getUniqueDeviceIds`,
        })
            .then((response) => {
                if (Array.isArray(response.data.deviceIds)) {
                    setDeviceIds(response.data.deviceIds);
                } else {
                    console.error('Device IDs data is not an array:', response.data.deviceIds);
                    setDeviceIds([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching device IDs:', error);
                setDeviceIds([]);
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
            setSelectedDeviceId("");
            setSelectedDeviceLogData([]);
            setCurrentPage(1); // Reset main pagination when no device is selected
        } else {
            setSelectedDeviceId(newDeviceId);
            fetchDataById(newDeviceId);
        }
    };

    const handleRowClick = (index) => {
        if (index === expandedRowIndex) {
            setExpandedRowIndex(-1);
        } else {
            setExpandedRowIndex(index);
        }
    };

    const indexOfLastSelectedDeviceItem = selectedDeviceCurrentPage * selectedDeviceItemsPerPage;
    const indexOfFirstSelectedDeviceItem = indexOfLastSelectedDeviceItem - selectedDeviceItemsPerPage;
    const currentSelectedDeviceItems = selectedDeviceLogData.slice(
        indexOfFirstSelectedDeviceItem,
        indexOfLastSelectedDeviceItem
    );

    const handleSelectedDevicePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(selectedDeviceLogData.length / selectedDeviceItemsPerPage)) {
            setSelectedDeviceCurrentPage(newPage);
        }
    };

    return (
        <div className="App">
            <div className="page-wrapper">
                <div className={`page-content ${sidebarVisible ? 'content-moved-left1' : 'content-moved-right1'}`}>
                    <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '0px' }}>App Logs</h1>
                    <hr style={{ borderTop: '2px solid #333', marginLeft: sidebarVisible ? '0' : '0px' }} />
                    <div className=" mt-3">
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
                                    <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <table className="table mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>deviceId</th>
                                                    <th>DateTime</th>
                                                    <th>Log String</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <LogsLoader rowsNum={itemsPerPage} />
                                                ) : (
                                                    selectedDeviceId !== ''
                                                        ? currentSelectedDeviceItems.map((log, index) => (
                                                            <tr
                                                                key={index}
                                                                onClick={() => handleRowClick(index)}
                                                                style={{
                                                                    height: expandedRowIndex === index ? 'auto' : '50px',
                                                                    whiteSpace: expandedRowIndex === index ? 'break-spaces' : 'nowrap',
                                                                    textOverflow: expandedRowIndex === index ? 'inherit' : 'ellipsis',
                                                                }}
                                                            >
                                                                <td title={log.deviceId}>
                                                                    {log.deviceId}
                                                                </td>
                                                                <td title={log.dateTime}>
                                                                    {log.dateTime}
                                                                </td>
                                                                <td title={log.logString}>
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
                                                                    <td title={log.deviceId}>
                                                                        {log.deviceId}
                                                                    </td>
                                                                    <td title={log.dateTime}>
                                                                        {log.dateTime}
                                                                    </td>
                                                                    <td title={log.logString}>
                                                                        {log.logString}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            : (
                                                                <tr>
                                                                    <td colSpan="3" style={{ textAlign: 'center' }}>
                                                                        <div style={{ display: 'inline-block' }}>
                                                                            <p>No Data available.</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
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
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSelectedDevicePageChange(selectedDeviceCurrentPage - 1)}
                        disabled={selectedDeviceCurrentPage === 1}
                        style={{ marginRight: '2px' }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSelectedDevicePageChange(selectedDeviceCurrentPage + 1)}
                        disabled={selectedDeviceCurrentPage === Math.ceil(selectedDeviceLogData.length / selectedDeviceItemsPerPage)}
                        style={{ marginRight: '2px' }}
                    >
                        Next
                    </Button>
                    <Dropdown>
    <Dropdown.Toggle variant="secondary" size="sm" disabled={selectedDeviceId !== ""}>
        {selectedDeviceId === "" ? `Items per page:${itemsPerPage}`:`Items per page: 10 `}
    </Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleItemsPerPageChange(2)}>2</Dropdown.Item>
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
