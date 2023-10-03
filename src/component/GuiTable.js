import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker CSS

function GuiTable() {
    const [logData] = useState([
        {
            level: "info",
            date: "2023-09-27 23:59:00",
            apiRequest: "Cron work on Wednesday midnight Successfully.",
        },
        {
            level: "info",
            date: " 2023-09-29 01:21:22",
            apiRequest: "{\"deviceId\":\"398B164B-A6C1-4207-BBBB-6A14713BC9CA\",\"employeeId\":\"POC0001\",\"date\":\"2023-09-28T19:35:56.666Z\",\"day\":\"28\",\"month\":\"9\",\"year\":\"2023\",\"timeHour\":0,\"timeMinute\":1,\"yourLocation\":\"Daly City\",\"destination\":\"South San Francisco\",\"distanceKM\":0.8468920923395536,\"startTime\":\"12:35 PM\",\"transportationMode\":\"SUV\",\"mode\":\"car\",\"motionDetectedTrip\":true,\"idlingTimeSec\":0,\"endTime\":\"2023-09-28 12:37:37.838\"} ",
            apiResponse: "  {\n  _id: 'POC0001',\n  company_code: 'TM0001',\n  fuelType: 'EV',\n  purchase_company: '東京日産自動車販売（株）',\n  totalTripsCo2Emit: 211.48,\n  totalCommunitysCo2Emit: 0,\n  monthlyAverageCo2Emit: 16.27,\n  license_plate: '品川302ほ5771',\n  employee_id: 'POC0001',\n  duid_vehicle_id: '2708',\n  annual_carbon_emit: [\n    {\n      user_emit: 0.86,\n      community_emit: 0,\n      monthly_average: 0.26,\n      createdAt: '2023-8-01'\n    },\n    {\n      user_emit: 0,\n      community_emit: 0,\n      monthly_average: 0.16,\n      createdAt: '2023-7-01'\n    },\n    {\n      user_emit: 0.66,\n      community_emit: 0,\n      monthly_average: 0.2,\n      createdAt: '2023-5-01'\n    },\n    {\n      user_emit: 0.16,\n      community_emit: 0,\n      monthly_average: 0.1,\n      createdAt: '2023-4-01'\n    },\n    {\n      user_emit: 0.02,\n      community_emit: 0,\n      monthly_average: 0.05,\n      createdAt: '2023-3-01'\n    },\n    {\n      user_emit: 0.13,\n      community_emit: 0,\n      monthly_average: 0.07,\n      createdAt: '2023-1-01'\n    },\n    {\n      user_emit: 0,\n      community_emit: 0,\n      monthly_average: 0,\n      createdAt: '2022-12-01'\n    }\n  ],\n  fuel_efficiency: '0.15',\n  createdAt: 2022-08-30T04:43:56.185Z,\n  updatedAt: 2023-09-28T20:19:05.065Z,\n  __v: 0\n} ",
            co2Request: " {\"distance\":0.8468920923395536,\"transportation_type\":\"SUV\"} ",
            co2Response: " {\"status\":\"success\",\"result\":\"0.008638299341863448\"} ",
            adaptRequest: " {\"sys_datetime\":\"2023-09-28T20:19:05.000Z\",\"vehicle_id\":\"2708\",\"trip_id\":\"6515dfb4bcd456f4b94a04cb\",\"dateTime\":\"2023-09-28T19:35:56.666Z\",\"distance\":\"0.8468920923395536\",\"co2e\":\"0.008638299341863448\",\"status\":\"new\"} ",
            adaptResponse: " {\"result\":\"No dataset found for this request\",\"status\":\"failed\"}  "
        },
        {
            level: "info",
            date: " 2023-09-29 23:59:00",
            apiRequest: "Cron work on Thursday midnight Successfully. "
        },
        {
            level: "info",
            date: " 2023-10-02 23:59:00",
            apiRequest: "Cron work on Monday midnight Successfully. "
        },
        {
            level: "info",
            date: " 2023-10-02 23:59:00",
            apiRequest: "Cron work on Monday midnight Successfully. "
        },
        [
            "\r\n"
        ]
    ]);
  
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('All Fields');
    const [selectedDate, setSelectedDate] = useState(null);
    const [newSearchTerm, setNewSearchTerm] = useState('');
    const [newSearchTermCompany, setNewSearchTermCompany] = useState('');
    const [employeeIdFilter, setEmployeeIdFilter] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        setSelectedDate(null); // Clear selected date on component mount
    }, []);

    const filterData = (data) => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        const newSearchTermLowerCase = newSearchTerm.toLowerCase();
        const newSearchTermCompanyLowerCase = newSearchTermCompany.toLowerCase();
        const employeeIdFilterLowerCase = employeeIdFilter.toLowerCase();
        
        return data.filter((log) => {
            const level = (log.level || '').toLowerCase();
            const logDate = new Date(log.date);
            const apiRequest = (log.apiRequest || '').toLowerCase();
            const apiResponse = (log.apiResponse || '').toLowerCase();
            const co2Request = (log.co2Request || '').toLowerCase();
            const co2Response = (log.co2Response || '').toLowerCase();
            const adaptRequest = (log.adaptRequest || '').toLowerCase();
            const adaptResponse = (log.adaptResponse || '').toLowerCase();

            const selectedDateStart = new Date(selectedDate);
            selectedDateStart.setHours(0, 0, 0, 0);
            const selectedDateEnd = new Date(selectedDate);
            selectedDateEnd.setHours(23, 59, 59, 999);

            const dateMatches = !selectedDate || (logDate >= selectedDateStart && logDate <= selectedDateEnd);

            return (
                (searchField === "All Fields" ||
                    (searchField === "Level" && level.includes(searchTermLowerCase)) ||
                    (searchField === "Date" && dateMatches) ||
                    (searchField === "Api Request" && apiRequest.includes(searchTermLowerCase)) ||
                    (searchField === "Api Response" && apiResponse.includes(searchTermLowerCase)) ||
                    (searchField === "Co2 Request" && co2Request.includes(searchTermLowerCase)) ||
                    (searchField === "Co2 Response" && co2Response.includes(searchTermLowerCase)) ||
                    (searchField === "Adapt Request" && adaptRequest.includes(searchTermLowerCase)) ||
                    (searchField === "Adapt Response" && adaptResponse.includes(searchTermLowerCase))
                ) &&
                (newSearchTerm === '' || apiRequest.includes(newSearchTermLowerCase)) &&
                (newSearchTermCompany === '' || apiResponse.includes(newSearchTermCompanyLowerCase)) &&
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
     
    return (
        <div className="App">
            <div className="page-wrapper">
                <div className="page-content">
                    <h1 style={{ margin: '0' }}> Logger Gui</h1>
                    <hr style={{ borderTop: '2px solid #333' }} />
                    <div className="container mt-3">
                        <div className="row justify-content-center">
                            <div className="col-lg-11">
                                <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                    <label htmlFor="search" style={{ marginRight: '10px' }}>Search: </label>
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
                                    <div style={{ marginLeft: '3px', width: '180px', backgroundColor: 'white !important' }}>
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
                                        <table className="table mb-0">
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
                                                {filteredData.map((log, index) => (
                                                    <tr key={index}>
                                                        <td>{log.level}</td>
                                                        <td>{log.date}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.apiRequest}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.apiResponse}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.co2Request}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.co2Response}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.adaptRequest}</td>
                                                        <td style={{ whiteSpace: 'normal' }}>{log.adaptResponse}</td>
                                                    </tr>
                                                ))}
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
