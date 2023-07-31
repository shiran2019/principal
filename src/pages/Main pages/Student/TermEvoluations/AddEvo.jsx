import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataGrid,GridToolbar }from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const columns = [
  { field: 'EvoId', headerName: 'ID', width: 90 },
  {
    field: 'EvoType',
    headerName: 'Evoluation type',
    width: 200,
    editable: false,
    renderCell: renderCellExpand,
  },
  {
    field: 'Activity',
    headerName: 'Activity',
    width: 200,
    editable: true,
    renderCell: renderCellExpand,
  },

  {
    field: 'Day',
    headerName: 'Day',
    width: 200,
    editable: true,
    type: 'date',
  valueGetter: ({ value }) => value && new Date(value),
        
    
    
  },
  {
    field: 'Note',
    headerName: 'Details',
    width: 400,
    editable: true,
    renderCell: renderCellExpand,
  },
 
];

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}
function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: '100%',
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});
export default function AddEvo() {
  const [teacherArray, setTeacherArray] = useState([]);
  const [tableArray, setTableArray] = useState([]);
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);


  const initialValues = {
    EvoType: "",
    Activity: "",
    Day: "",
    Note: "",
  };

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://localhost:3001/createEvoluations", data,{headers :{accessToken :sessionStorage.getItem("accessToken")}} )
      .then((response) => {
        if (response.data.error) {
         
          toast.warn(response.data.error)
          setSubmissionStatus("error");
        }else
        {
        setSubmissionStatus("success");
        resetForm();
        tableData();
        
        toast.success("Success")

        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
      
        toast.warn("Error: " + error.message)
      });
  };

  const tableData = () => {
    axios
      .get("http://localhost:3001/createEvoluations")
      .then((response) => {
        // Modify the data to set `EvoId` as the `id` property for each row
        const modifiedData = response.data.map((row) => ({
          ...row,
          id: row.EvoId, // Set `EvoId` as the `id` property
        }));
  
        setTableArray(modifiedData);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };
  

  useEffect(() => {
    axios
      .get("http://localhost:3001/teachers/tch")
      .then((response) => {
        setTeacherArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    tableData();

  }, []);
  const mySaveOnServerFunction = (params) => {
    

    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/createEvoluations/upd/${params.EvoId}`,params )
      .then((response) => {
    
        toast.success("Updated")
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "20px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 40px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
  };

  const formStyle = {
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    // maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const validate1 = (value) => {
    let error;
    if (!value) {
      error = "Type is required";
    }
    return error;
  };

  const validate2 = (value) => {
    let error;
    if (!value) {
      error = "Details are required";
    }
    return error;
  };

  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Activity is required";
    }
    return error;
  };

  
  const validate4 = (value) => {
    let error;
    if (!value) {
      error = "Date is required";
    }
    return error;
  };
  const buttonStylex = {
    padding: "10px 40px",
    backgroundColor: "#f59e42",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
    marginLeft: "10px",
  };
  return (
    <>
       <div>
<a href="#sec1">
<button style={buttonStylex}>
Add new Evoluation type
</button></a>
<a href="#sec2">
<button style={buttonStylex}>
Pre define Term Evoluations
</button></a>
</div>
<hr></hr>
      <div style={{ padding: "1px 20px" }}>
        <Row>
       
      
          <Col id = "sec1"  xs={12}style={{ paddingBottom: "10px" }}>
            <center>
              <h2 style={{ paddingTop: "40px" }}>
                Add new Evoluation type
              </h2>
            </center>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              <Form style={formStyle}>
                <Row>
                  <Col  xs={12} lg={6}>
                    <label style={labelStyle}>Type :</label>
                    <Field
                      id="inputCreatePost"
                      name="EvoType"
                      style={inputStyle}
                      validate={validate1}
                    />
                    <ErrorMessage
                      name="EvoType"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                  <Col xs={12} lg={6}>
                    <label style={labelStyle}>Activity:</label>
                    <Field
                      id="inputCreatePost"
                      name="Activity"
                      style={inputStyle}
                      validate={validate3}
                    />
                    <ErrorMessage
                      name="Activity"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col  xs={12} lg={6}>
                    <label style={labelStyle}>Date:</label>
                    <Field
                      type="date"
                      id="inputCreatePost"
                      name="Day"
                      style={inputStyle}
                      validate={validate4}

                    />
                    <ErrorMessage
                      name="Day"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} lg={12}>
                    <label style={labelStyle}>Details:</label>
                    <Field
                      as="textarea"
                      id="inputCreatePost"
                      name="Note"
                      style={inputStyle}
                      validate={validate2}
                    />
                    <ErrorMessage
                      name="Note"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>


                <Row>
                  <Col>
                    <div style={{ textAlign: "right" }}>
                      <button type="submit" style={buttonStyle}>
                        Add
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Formik>
          </Col>
          <Col id = "sec2" xs={12}>
            <center>
              <h2 style={{ paddingBottom: "10px" }}>Evoluation types</h2>
            </center>
            <Box sx={{ height: 400, width: '100%' }}>
           <DataGrid
        rows={tableArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={(updatedRow, originalRow) =>
          mySaveOnServerFunction(updatedRow)
        }
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
          </Col>
    
  </Row>
      </div>
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
    </>
  );
}
