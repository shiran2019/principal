import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddEvo from "./AddEvo";
import Marks from "./Marks";
import TermEvo from "./TermEvo";
import NavigationBar from "../../../../components/Navbar";
import { AuthContext } from "../../../../helpers/AuthContext";
import { useState, useContext } from "react";


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

export default function TermEvos() {
  const [value, setValue] = React.useState(0);
  const { authState } = useContext(AuthContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
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
           
        
          <Tab label="Add Marks" {...a11yProps(0)} />
          <Tab label="Evaluation Results" {...a11yProps(1)} />
          {authState.role === "Admin" && (
                    <Tab label="Add New Term Evaluation" {...a11yProps(2)} />
                  )}
        </Tabs>
      </Box>
      <div style={{ width: "800px", height: "auto", flexGrow: 1 }}>
      {authState.role === "Admin" && (
                    <TabPanel value={value} index={2}>
                    <AddEvo />
                  </TabPanel>
                )}

      
        <TabPanel value={value} index={0}>
          <Marks />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{maxWidth:"100%" ,display: "flex", justifyContent: "flex-start" }}>
            <TermEvo />
          </div>
        </TabPanel>
      </div>
    </Box>
   
    </div>
    </>
  );
}
