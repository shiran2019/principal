import React from 'react'
import NavigationBar from '../../../components/Navbar'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from "axios";
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'meetingType',
    headerName: 'Meeting type',
    width: 150,
    editable: true,
    renderCell: renderCellExpand,
  },
  {
    field: 'Day',
    headerName: 'Date',
    width: 150,
    editable: true,
    type: 'date',
    valueGetter: ({ value }) => value && new Date(value),
  },
   {
    field: 'guestNames',
    headerName: 'Guest names',
    width: 250,
    editable: true,
    renderCell: renderCellExpand,
  },
  {
    field: 'Discription',
    headerName: 'Description',
    editable: true,
    width: 500,
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


export const GuestMeetings = () => {


    const [reqArray, setReqArray] = useState([]);
    

    
    const onSubmit = (data,  resetForm ) => {

  
        axios
        .post("http://localhost:3001/guestMeetings", data)
        .then((response) => {
          alert("Added new class successfully");
          ShowRequests();
          resetForm();
          ShowRequests();
          
        }).then((response) => {
          
          resetForm();
        
          
        })
        .catch((error) => {
          console.log(error);
        });
        };

        useEffect(() => {
            ShowRequests();
        }, []);
       

            const ShowRequests = () => {
                axios
                  .get(`http://localhost:3001/guestMeetings`)
                  .then((response) => {
                    setReqArray(response.data);
                  })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });
              };
        

    const initialValues = {
      guestNames: "",
        Day: "",
        meetingType: "",
        Discription: "",
        
      };

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const noteStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "italic",
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
    padding: "10px 30px",
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
    maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };



  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Fill the field";
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


  const mySaveOnServerFunction = (params) => {
   
    


    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/guestMeetings/upd/${params.id}`,params )
      .then((response) => {
        toast.success("Updated");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
    <div><NavigationBar/></div>
    <div>
    <div style={{padding:"0px  10%" }}>
<a href="#sec1">
<button style={buttonStylex}>
Add new record
</button></a>
<a href="#sec2">
<button style={buttonStylex}>
Meeting records
</button></a>
</div>
<hr></hr>


        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form id = "sec1">
                <h1 style={{padding:"0px  10%" , marginBottom:"20px"}}>Add new record </h1>
                <Row  style={{padding:"0px  10%"}}>
            <Col xs={12} lg={4}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Meeting type :
                  </label>
                  <Field
            
                    name="meetingType"
                    className="form-control"
                    validate = {validate3}
                    style={{
            
                      padding: "10px",
                      
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="meetingType"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                
                
                <Col xs={12} lg={4}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Date :
                  </label>
                  <Field
                    type="date"
                    name="Day"
                    validate = {validate3}
                    className="form-control"
                    style={{
                      padding: "10px",
                     
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="Day"
                    component="span"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={8}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Guest Names :
                  </label>
                  <Field
                    as="textarea"
                    validate = {validate3}
                    name="guestNames"
                    className="form-control"
                    style={{
                      padding: "10px",
                    
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="guestNames"
                    component="span"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col xs={12} lg={8}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Description :
                  </label>
                  <Field
                    as="textarea"
                    validate = {validate3}
                    name="Discription"
                    className="form-control"
                    style={{
                      padding: "10px",
                     
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="Discription"
                    component="span"
                    style={{color: "red" }}
                  />
                </Col>
                </Row>
                <Row style={{padding:"0px  10%"}}>
                <Col>
                <button type="submit" style={buttonStyle}>
                    Submit
                    </button>
                </Col>
                </Row>
                <Row style={{padding:"0px  10%"}}>
                    <Col lg={8}>
                <hr style={{marginTop:"10px"}}></hr>
                </Col>

                </Row>

                </Form>
        </Formik>


    </div>
    <div id ="sec2">
    <h2  style={{padding:"25px  10%" , marginBottom:"20px"}}>Meeting Records </h2>
   
    <Row  style={{padding:"0px  10%"}}>

    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={reqArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
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
    </Row>

    </div>

    <ToastContainer 
style={{marginTop:"7%"}}  
position="top-center" 
autoClose={3000} />

    </>
  )
}
