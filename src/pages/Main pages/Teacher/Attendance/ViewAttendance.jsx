
import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";



const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'teacherId',
    headerName: 'teacher Id',
    width: 150,
    editable: false,
  },
  {
    field: 'Day',
    headerName: 'Day',
    type: 'Date',
    width: 150,
    editable: false,
  },
   {
    field: 'Attendance',
    headerName: 'Attendance',
    width: 100,
    editable: true,
    type: "singleSelect",
    valueOptions: ["Present", "Absent"]
  },
];

export default function ViewAttendance() {
  const [stdArray, setStdArray] = useState([]);
  

  useEffect(() => {
    
    axios
    .get(`http://localhost:3001/TeacherAttendance`)
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

  const mySaveOnServerFunction = (params) => {
   
  

    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/TeacherAttendance/upd/${params.teacherId}/${params.Day}`,params )
      .then((response) => {
       
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
     
     <Row>
    
     <center> <Col lg={7}>

     <h1>Teacher Attendance list</h1>
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
        processRowUpdate={(updatedRow, originalRow) =>
          mySaveOnServerFunction(updatedRow)
        }
        slots={{
          toolbar: GridToolbar,
        }}
        //onCellEditStop={}
      />
    </Box>
      </Col></center>
     </Row>
   
     </>
   
  );
}