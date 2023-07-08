
import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";



const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'StudentId',
    headerName: 'Student Id',
    width: 150,
    editable: true,
  },
  {
    field: 'Day',
    headerName: 'Paid Day',
    type: 'Date',
    width: 150,
    editable: true,
  },
   {
    field: 'Month',
    headerName: 'Month',
    width: 100,
    editable: true,
  },{
    field: 'Note',
    headerName: 'Notes',
    width: 100,
    editable: true,
  }
];

export default function ViewPayment() {
  const [stdArray, setStdArray] = useState([]);


  useEffect(() => {
    axios
    .get(`http://localhost:3001/StudentPayment`)
    .then((response) => {
      console.log(response.data);
      const rowsWithId = response.data.map((row, index) => ({
        ...row,
        id: index + 1, // Generate a unique id using index or use a unique identifier from your data
      }));
      setStdArray(rowsWithId);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  

      
  }, []);


  return (
    <>
     
     <Row>
    
     <center> <Col lg={7}>

     <h1>Payments List,</h1>
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={stdArray}
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
      />
    </Box>
      </Col></center>
     </Row>
   
     </>
   
  );
}