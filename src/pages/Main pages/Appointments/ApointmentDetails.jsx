import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NavigationBar from "../../../components/Navbar";
import Appointments from "./Appointments";
import RequestAppointment from "./RequestAppointment";

import AproveReq from "./AprovedRequests";
import { AuthContext } from "../../../helpers/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ApointmentDetails() {
  const [authState, setAuthState] = useState({
    user: "",
    status: false,
    id: 0,
    role: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data.role);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else if (response.data.role == "Student") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role == "Admin") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role == "Teacher") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else console.log("fsgfgfg");
      });
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="App">
          <NavigationBar />
        </div>
        <div>
          <Box sx={{ display: "flex", height: "100%" }}>
            <Box sx={{ borderRight: 5, borderColor: "divider" }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                {authState.role === "Student" && (
                  <Tab label="Request" {...a11yProps(0)} />
                )}

                {authState.role === "Student" && (
                  <Tab label="Approved requests" {...a11yProps(1)} />
                )}

              
              </Tabs>
            </Box>
            <div style={{ width: "800px", height: "auto", flexGrow: 1 }}>
              {authState.role === "Student" && (
                <TabPanel value={value} index={0}>
                  <RequestAppointment />
                </TabPanel>
              )}

              {authState.role === "Student" && (
                <TabPanel value={value} index={1}>
                  <AproveReq />
                </TabPanel>
              )}

              
            </div>
          </Box>
        </div>
      </AuthContext.Provider>
    </>
  );
}
