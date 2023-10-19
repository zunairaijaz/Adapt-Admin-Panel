import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import config from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '../style/app.css';
import LogsLoader from './LogsLoader';
import { DevicesOutlined } from '@material-ui/icons';
import { FirstPage, LastPage } from '@mui/icons-material';

function LogsTable({ sidebarVisible }) {
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [deviceIds, setDeviceIds] = useState([]);
    const [selectedDeviceLogData, setSelectedDeviceLogData] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(1);

    useEffect(() => {
        fetchData(1, itemsPerPage, "");
        fetchDeviceIds();
    }, [itemsPerPage]);

    useEffect(() => {
        if (selectedDeviceId === "") {
            setSelectedDeviceLogData([]);
        }
    }, [selectedDeviceId]);

    const fetchData = (page, perPage, deviceId) => {
        setLoading(true);
        const url = deviceId === "" // Check for an empty string
        ? `${config.NEW_SERVER_URL}/getVehicleLogDatapaginated?page=${page}&perPage=${perPage}`
        : `${config.NEW_SERVER_URL}/getVehicleLogDatapaginated?page=${page}&perPage=${perPage}&deviceId=${deviceId}`;
    
        axios
            .get(url)
            .then((response) => {
                if (response.data.success) {
                    const sortedLogData = response.data.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
                    setLogData(sortedLogData);                   
                    setTotalPages(Math.ceil(response.data.totalPages));
                    setTotalLogs(Math.ceil(response.data.totalLogs));

                    setLoading(false);
                } else {
                    console.error('Error fetching data:', response.data.error);
                    toast.error('Error fetching data: ' + response.data.error);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data: ' + error.message);
                setLoading(false);
            });
    };
    
   

    const fetchDeviceIds = () => {
        axios.get(`${config.NEW_SERVER_URL}/getUniqueDeviceIds`)
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

    const handleMainLogPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchData(newPage, itemsPerPage, selectedDeviceId); // Pass the selectedDeviceId
        }
    };

    const handleMainLogItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleDeviceIdChange = (newDeviceId) => {
        if (newDeviceId === "") { // Check for an empty string, not " "
            // When "All Devices" is selected, fetch all data and reset the page to 1
            setSelectedDeviceId("");
            setSelectedDeviceLogData([]);
            setCurrentPage(1); // Reset the page number to 1
            fetchData(1, itemsPerPage, ""); // Pass an empty string
        } else {
            // When a specific device is selected, fetch data for that device and reset the page to 1
            setSelectedDeviceId(newDeviceId);
            setCurrentPage(1); // Reset the page number to 1
            fetchData(1, itemsPerPage, newDeviceId);
        }
    };
    
    

    const handleRowClick = (index) => {
        if (index === expandedRowIndex) {
            setExpandedRowIndex(-1);
        } else {
            setExpandedRowIndex(index);
        }
    };
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const visiblePageCount = 3; // Number of visible page numbers
    
        const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
        const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
    
        const selectedButtonStyle = {
            background: 'blue',
            border: '1px solid lightgrey',
            color: 'white',
            marginRight: '3px',
        };
    
        const buttonStyle = {
            background: 'transparent',
            border: '1px solid lightgrey',
            marginRight: '3px',
        };
    
        if (currentPage > 1) {
            pageNumbers.push(
                <Button
                    key="previous"
                    variant=""
                    size="sm"
                    style={buttonStyle}
                    onClick={() => handleMainLogPageChange(currentPage - 1)}
                >
                    Previous
                </Button>
            );
        }
        if (currentPage > 1) {
            pageNumbers.push(
                <Button
                    key="first"
                    variant=""
                    size="sm"
                    style={buttonStyle}
                    onClick={() => handleMainLogPageChange(1)}
                >
                    <FirstPage />
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
    
        if (currentPage < totalPages - 1) {
            pageNumbers.push(
                <Button
                    key="last"
                    variant=""
                    size="sm"
                    style={buttonStyle}
                    onClick={() => handleMainLogPageChange(totalPages)}
                >
                    <LastPage />
                </Button>
            );
        }
        if (currentPage < totalPages) {
            pageNumbers.push(
                <Button
                    key="next"
                    variant=""
                    size="sm"
                    style={buttonStyle}
                    onClick={() => handleMainLogPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            );
        }
    
        return pageNumbers;
    };
    
    const getRangeLabel = () => {
        if (totalLogs === 0) {
            return '0 items';
        }

        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, totalLogs);
        const total = totalLogs;

        return `${start} to ${end} / ${total} items`;
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <FormControl variant="outlined" style={{ width: '200px' }}>
                                        <InputLabel>{selectedDeviceId === " " ? "All Devices" : "Device Id"}</InputLabel>
                                        <Select
                                            value={selectedDeviceId}
                                            onChange={(e) => handleDeviceIdChange(e.target.value)}
                                            label={selectedDeviceId === " " ? "All Devices" : "DeviceId"}
                                        >
                                            <MenuItem value=" ">All Devices</MenuItem>
                                            {deviceIds.map((deviceId) => (
                                                <MenuItem key={deviceId} value={deviceId}>
                                                    {deviceId}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" style={{ width: '200px' }}>
                                        <InputLabel>Items per Page</InputLabel>
                                        <Select
                                            value={itemsPerPage}
                                            onChange={(e) => handleMainLogItemsPerPageChange(e.target.value)}
                                            label="Items per Page"
                                        >
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <table className="table mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Device ID</th>
                                                    <th>DateTime</th>
                                                    <th>Log String</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                                {loading ? (
                                                    <LogsLoader rowsNum={itemsPerPage} />
                                                ) : (
                                                    
                                                        logData.map((log, index) => (
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
    variant="primary"
    size='sm'
    style={{
        marginLeft: sidebarVisible ? '300px' : '130px', // Conditionally set marginLeft
        marginBottom: '80px',
        backgroundColor: 'blue',
        color: 'white',
        borderRadius: '5px',
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

export default LogsTable;
