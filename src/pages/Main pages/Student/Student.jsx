import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';



export default function StdTable() {


  
  const [stdArray, setStdArray] = useState([]);

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
  


  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'StudentId',
      headerName: 'Student Id',
      width: 100,
      editable: false,
    },
    {
      field: 'fName',
      headerName: 'First name',
      width: 100,
      editable: true,
    },
    {
      field: 'lName',
      headerName: 'Last name',
      width: 100,
      editable: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      editable: true,
    },
    {
      field: 'birthday',
      headerName: 'Birthday',
      type: 'Date',
      width: 110,
      editable: true,
    },
    {
      field: 'className',
      headerName: 'Class room',
      width: 150,
      editable: true,
    },
    {
      field: 'regyear',
      headerName: 'Registed year',
      width: 110,
      editable: true,
    },
    {
      
      field: 'pNote',
      headerName: 'Special note',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      renderCell: renderCellExpand,
      width: 160,
      editable: true,
    },{
      field: 'status',
      headerName: 'Status',
      width: 110,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Active", "Inactive"]
    },
  ];
  
  


  function renderCellExpand(params) {
    return (
      <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
    );
  }

  

  useEffect(() => {
    axios
      .get(`http://localhost:3001/students/studentListAdmin`)
      .then((response) => {
        setStdArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const mySaveOnServerFunction = (params) => {
    
    


    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/students/upd/${params.StudentId}`,params )
      .then((response) => {
       
        toast.success("Updated")
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
      <div className="App">
        <NavigationBar />
      </div>
      <div>
        <Row>
          <center>
            <Col lg={10}>
              <h1>Our students</h1>
              <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={stdArray}
                  columns={columns}
               //  onCellEditStop={handleCellEditChange} // Attach the event handler
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                  processRowUpdate={(updatedRow, originalRow) =>
                    mySaveOnServerFunction(updatedRow)
                  }
                  slots={{
                    toolbar: GridToolbar,
                  }}

                  
                  

                />
              </Box>
            </Col>
          </center>
        </Row>
      </div>
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
    </>
  );
}
