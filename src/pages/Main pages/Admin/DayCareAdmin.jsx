import React from 'react'
import NavigationBar from '../../../components/Navbar'
import { Row, Col, Alert } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import Box from "@mui/material/Box";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
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
    }, {
      field: 'fatherName',
      headerName: 'Father name',
      width: 150,
      editable: false,
    },
    {
      field: 'fatherNo',
      headerName: 'Father Mobile',
      width: 150,
      editable: true,
    },
    {
      field: 'motherName',
      headerName: 'Mother name',
      width: 150,
      editable: true,
    },
    {
      field: 'motherNo',
      headerName: 'Mother Mobile',
      width: 150,
      editable: true,
    },
  ];
export const DayCareAdmin = () => {
    const [stdArray, setStdArray] = useState([]);

    useEffect(() => {
        axios
          .get(`http://localhost:3001/students/Daycare`)
          .then((response) => {
            const modifiedData = response.data.map((row) => ({
                ...row,
                id: row.StudentId, // Set `EvoId` as the `id` property
              }));
            setStdArray(modifiedData);
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      }, []);
  return (
    <>
    <div className="App">
        <NavigationBar />
        
      </div>
      <div>
        <Row>
          <center>
            <Col lg={10}>
              <h1>Daycare student list</h1>
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
                 
                 
                  slots={{
                    toolbar: GridToolbar,
                  }}

                  
                  

                />
              </Box>
            </Col>
          </center>
        </Row>
      </div>
      <ToastContainer 
style={{marginTop:"7%"}}  
position="top-center" 
autoClose={3000} />

    </>
  
  )
}
