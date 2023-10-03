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
function Time() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios({
      method: "post",
      url: `${config.SERVER_URL}/admin/getTime`,
    })
      .then((response) => {
        console.log("response data: ", response);

        console.log(response.data.time._id);
        // Set the Id state with a valid value here
        setId(response.data.time._id); // Assuming _id is available in the API response
        // console.log("id is --->11"
        //   , Id);
        if (typeof response.data.time === "object") {
          const updatedData = Object.keys(response.data.time).map((day) => {
            const dayData = response.data.time[day];

            return {
              day: day,
              start_time: dayData.start_time || "",
              end_time: dayData.end_time || "",
              set: dayData.set || "",
            };
          });

          setIsArray(updatedData); // Update isArray with fetched data
          setData(updatedData); // Also update data if needed
        } else {
          console.error("Invalid data structure in API response");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  const updateRow = (day) => {
    console.log("Id in updateRow: ", Id); // Add this line to check the value of Id
    const Shr = Number(data[day].start_time.split(":")[0]) * 60;
    const Sm = Number(data[day].start_time.split(":")[1]);
    const Ehr = Number(data[day].end_time.split(":")[0]) * 60;
    const Em = Number(data[day].end_time.split(":")[1]);
    if (Shr + Sm < Ehr + Em) {
      const payload = {
        day: data[day].day,
        data: {
          start_time: data[day].start_time,
          end_time: data[day].end_time,
          set: data[day].set,
        },
        _id: Id, // Include the _id here
      };
      axios({
        method: "post",
        url: `${config.SERVER_URL}/admin/updateTime`,
        data: payload,
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Data updated successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
            });
            fetchData(); // Refresh data after successful update
          } else {
            toast.error("Failed to update data. Please try again.");
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      toast.error("End time must be greater than Start time");
    }
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
  return (
    <div className="App">
      <Header />
      <SideBar />
      <div className="page-wrapper">
        <div className="page-content">
        <h1 style={{ margin: '0' }}>Time</h1>
          <hr style={{ borderTop: '2px solid #333' }} />
          <div className="container mt-3">
            <div className="row justify-content-center">
              <div className="col-lg-11">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Day</th>
                        <th>Business Hours</th>
                        <th>Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(
                        (row, index) =>
                          row.day !== "_id" && (
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

                              <td>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    console.log("Update button clicked");
                                    updateRow(index);
                                  }}
                                  style={{ width: "80%", height: "100%" }}
                                >
                                  Update
                                </Button>
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
