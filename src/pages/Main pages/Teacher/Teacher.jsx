import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'teacherId',
    headerName: 'Teacher Id',
    width: 150,
    editable: false,
  },
  {
    field: 'fName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
   {
    field: 'lName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'teacherNIC',
    headerName: 'NIC number',
    width: 150,
    editable: true,
  },
   {
    field: 'teacherNo',
    headerName: 'Contact',
    width: 150,
    editable: true,
  },
  {
    field: 'teacherEmail',
    headerName: 'E-mail',
    width: 210,
    editable: true,
  },
  {
    field: 'regDate',
    headerName: 'Registered date',
    type: 'Date',
    width: 150,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    editable: true,
    type: "singleSelect",
  valueOptions: ["Active", "Inactive"]
  },
  
];

export default function TchTable() {
  const [stdArray, setStdArray] = useState([]);


  useEffect(() => {
    axios
      .get(`http://localhost:3001/teachers/teacherListAdmin`)
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
      .put(`http://localhost:3001/teachers/upd/${params.teacherId}`,params )
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
    
     <center> <Col lg={10}>

     <h1>Our teachers</h1>
      <Box sx={{ height: 500, width: '100%' }}>
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
      />
    </Box>
      </Col></center>
     </Row>
     </div>
     <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
     </>
   
  );
}