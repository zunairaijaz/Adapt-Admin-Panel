import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Header from "./Header";
import SideBar from "./SideBar";
import config from "../config";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
// import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import TimezoneSelect from "react-timezone-select";
import UpdateIcon from '@mui/icons-material/Update';
import Grid from "@mui/material/Grid";
function Time({ sidebarVisible }) {
  const [data, setData] = useState([
    { day: "Monday", start_time: "", end_time: "", set: "" },
    { day: "Tuesday", start_time: "", end_time: "", set: "" },
    { day: "Wednesday", start_time: "", end_time: "", set: "" },
    { day: "Thursday", start_time: "", end_time: "", set: "" },
    { day: "Friday", start_time: "", end_time: "", set: "" },
    { day: "Saturday", start_time: "", end_time: "", set: "" },
    { day: "Sunday", start_time: "", end_time: "", set: "" },
  ]);
  const [Id, setId] = useState("");
  const [isArray, setIsArray] = useState([
    { day: "Monday", start_time: "", end_time: "", set: "" },
    { day: "Tuesday", start_time: "", end_time: "", set: "" },
    { day: "Wednesday", start_time: "", end_time: "", set: "" },
    { day: "Thursday", start_time: "", end_time: "", set: "" },
    { day: "Friday", start_time: "", end_time: "", set: "" },
    { day: "Saturday", start_time: "", end_time: "", set: "" },
    { day: "Sunday", start_time: "", end_time: "", set: "" },
  ]);
  const [companyId, setCompanyId] = useState(""); // State for selected company ID
  const [selectedTimezone, setSelectedTimezone] = useState("Etc/GMT");
  const [companyIds, setCompanyIds] = useState([]); // State for company IDs
  useEffect(() => {
    axios({
      method: "get",
      url: `${config.NEW_SERVER_URL}/getUniqueCompanyCodes`,
    })
      .then((response) => {
        console.log("Company Codes Response:", response.data);
        setCompanyIds(response.data.deviceIds); // Assuming the API returns an array of company codes
      })
      .catch((err) => {
        console.error("Error fetching company codes:", err);
      });
    fetchData();
  }, []);
  const fetchData = () => {
    axios({
      method: "post",
      url: `${config.NEW_SERVER_URL}/admin/getTime`,
    })
      .then((response) => {
        console.log("response data: ", response);
        console.log(response.data.time._id);
        setId(response.data.time._id);

        if (typeof response.data.time === "object") {
          const updatedData = Object.keys(response.data.time)
            .filter((day) => day !== "_id" && day !== "time_zone" && day !== "company_code" && day !== "__v")
            .sort((a, b) => {
              const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
              return daysOrder.indexOf(a) - daysOrder.indexOf(b);
            })
            .map((day) => {
              const dayData = response.data.time[day];
              return {
                day: day,
                start_time: dayData.start_time || "",
                end_time: dayData.end_time || "",
                set: dayData.set || "",
              };
            });

          setIsArray(updatedData);
          setData(updatedData);
        } else {
          console.error("Invalid data structure in API response");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const fetchCompanyData = (company_code) => {
    const payload = {
      company_code,
    };
    axios({
      method: "post",
      url: `${config.NEW_SERVER_URL}/admin/getCompanyTime`,
      data: payload,
    })
      .then((response) => {
        console.log("response data: ", response);
        console.log(response.data.time._id);
        setId(response.data.time._id);

        if (typeof response.data.time === "object") {
          const updatedData = Object.keys(response.data.time)
            .filter((day) => day !== "_id" && day !== "time_zone" && day !== "company_code" && day !== "__v")
            .sort((a, b) => {
              const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
              return daysOrder.indexOf(a) - daysOrder.indexOf(b);
            })
            .map((day) => {
              const dayData = response.data.time[day];
              return {
                day: day,
                start_time: dayData.start_time || "",
                end_time: dayData.end_time || "",
                set: dayData.set || "",
              };
            });

          if (response.data.time.time_zone) {
            setSelectedTimezone(response.data.time.time_zone);
          }

          setIsArray(updatedData);
          setData(updatedData);
        } else {
          console.error("Invalid data structure in API response");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const updateAllRows = () => {
    // Construct an array of data for all rows
    const dataArray = data.map((row) => {
      const Shr = Number(row.start_time.split(":")[0]) * 60;
      const Sm = Number(row.start_time.split(":")[1]);
      const Ehr = Number(row.end_time.split(":")[0]) * 60;
      const Em = Number(row.end_time.split(":")[1]);
      if (Shr + Sm < Ehr + Em) {
        return {
          day: row.day,
          data: {
            start_time: row.start_time,
            end_time: row.end_time,
            set: row.set,
          },
        };
      } else {
        toast.error(`End time must be greater than Start time for ${row.day}`);
        return null;
      }
    });
    // Filter out null entries (rows with invalid data)
    const validDataArray = dataArray.filter((row) => row !== null);
    // Create the payload with the array of data
    const payload = {
      data: validDataArray,
      _id: Id, // Include the _id here
      company_code: companyId,
      time_zone: selectedTimezone,
    };
    // Send the API call with the array of data
    axios({
      method: "post",
      url: `${config.NEW_SERVER_URL}/admin/updateTime`, // Update the API endpoint accordingly
      data: payload,
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Data updated successfully`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });
        } else {
          toast.error(`Failed to update data. Please try again.`);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  const handleChange = (event, rowIndex, fieldName) => {
    const updatedData = [...data];
    updatedData[rowIndex][fieldName] = event.target.value;
    setData(updatedData);
  };
  const handleSelectChange = (event, rowIndex) => {
    const updatedData = [...data];
    updatedData[rowIndex].set = event.target.value;
    setData(updatedData);
  };
  const handleCompanyChange = (event) => {
    const selectedCompanyId = event.target.value;
    setCompanyId(selectedCompanyId);
    // Fetch data for the selected company ID
    fetchCompanyData(selectedCompanyId);
    // fetchData();
  };
  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
    // Add your logic to fetch data based on the selected timezone
  };
  return (
    <div className="App">
      <div className="page-wrapper">
        <div className={`page-content ${sidebarVisible ? 'content-moved-left1' : 'content-moved-right1'}`}>
          <h1 style={{ margin: '0', marginLeft: sidebarVisible ? '0' : '0px' }}>Time</h1>
          <hr style={{ borderTop: '2px solid #333', marginLeft: sidebarVisible ? '0' : '0px' }} />
          <div className=" mt-3">
            <div className="row justify-content-center">
              <div className="col-lg-15">
                <FormControl style={{ marginBottom: "16px", width: '200px' }}>
                  <InputLabel id="company-id-label" style={{ marginTop: '-8px' }}>Company Code</InputLabel>
                  <Select style={{ height: '40px' }}
                    labelId="company-id-label"
                    id="company-id"
                    value={companyId}
                    label="Company ID"
                    onChange={handleCompanyChange}
                  >
                    {companyIds.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}

                  </Select>
                </FormControl>
                {/*Timezone-select */}
                <FormControl style={{ marginBottom: '16px', marginLeft: '10px' }}>
                  <InputLabel id="timezone-label"></InputLabel>
                  <TimezoneSelect
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                  />
                </FormControl>
                <Button
                  style={{ height: "37px", float: "right", position: "fixed !important" }}
                  variant="contained"
                  onClick={() => {
                    updateAllRows();
                  }}
                >
                  <UpdateIcon />Update
                </Button>
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Day</th>
                        <th>Business Hours</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(
                        (row, index) =>
                          row.day !== "_id" && row.day !== "time_zone" && row.day !== "company_code" && row.day !== "__v" && (
                            <tr key={index}>
                              <td>{row.day}</td>
                              <td>
                                <span> Start Time </span>
                                <input
                                  type="time"
                                  value={row.start_time}
                                  className="start-time"
                                  onChange={(event) =>
                                    handleChange(event, index, "start_time")
                                  }
                                />
                                <span> End Time </span>
                                <input
                                  type="time"
                                  value={row.end_time}
                                  className="end-time"
                                  onChange={(event) =>
                                    handleChange(event, index, "end_time")
                                  }
                                />
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <InputLabel id={`active-label-${index}`}>
                                    Active
                                  </InputLabel>
                                  <Select
                                    labelId={`active-label-${index}`}
                                    id={`active-${index}`}
                                    value={row.set}
                                    label="active"
                                    onChange={(event) =>
                                      handleSelectChange(event, index)
                                    }
                                    style={{
                                      fontSize: "12px",
                                      padding: "2px",
                                      height: "36px",
                                    }} // Decrease the height here
                                  >
                                    <MenuItem value="Open">Open</MenuItem>
                                    <MenuItem value="Close">Close</MenuItem>
                                  </Select>
                                </FormControl>
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
      <ToastContainer />
    </div>
  );
}

export default Time;
