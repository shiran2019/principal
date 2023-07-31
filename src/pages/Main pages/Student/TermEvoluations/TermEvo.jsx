import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import Box from "@mui/material/Box";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'StudentId',
    headerName: 'Student Id',
    width: 150,
    editable: false,
  },
  {
    field: 'Mark',
    headerName: 'Marks',
    width: 150,
    editable: true,
    type: "singleSelect",
    valueOptions: ["Very Good", "Good","Medium", "Need to improve"]
  },
  
];


export default function TermEvo() {
  const [lists, setLists] = useState([]);
  const [array, setArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/createEvoluations")
      .then((response) => {
        setArray(response.data);
        
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "50px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const handleRowClick = (rowId) => {
    setSelectedRowId(rowId);

   // console.log(filteredTableArray);
    const selectedRow = filteredTableArray.find((item) => item.EvoId === rowId);
    //console.log(selectedRow);
    if (selectedRow) {
      const EvoId = selectedRow.EvoId;
      axios
        .get(`http://localhost:3001/termEvoluations/${EvoId}`)
        .then((response) => {
          setLists(response.data);
         
          
          
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  useEffect(() => {
    const filteredData = array.filter((item) =>
      item.EvoType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTableArray(filteredData);
  }, [searchTerm, array]);

  const mySaveOnServerFunction = (params) => {
    
    


    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/termEvoluations/upd/${params.id}`,params )
      .then((response) => {
        toast.success("Updated");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
       
    <div style={{width:"100%"}}>
      <Row>
        <Col xs={12} lg={6}>
          <label style={labelStyle}>Search term evaluation here:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            placeholder="Search by EvoType"
            
          />
        </Col>
        </Row>
        <Row>
        <Col xs={12} lg={6}>
          <label style={labelStyle}>Term Evaluations</label>
          <Table  bordered hover>
            <thead>
              <tr>
                <th>Evoluation Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableArray.map((item) => (
                <tr
                  key={item.EvoId}
                  onClick={() => handleRowClick(item.EvoId)}
                  className={selectedRowId === item.EvoId ? "selected" : ""}
                >
                  <td>{item.EvoType}</td>
                  <td>{item.Day}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
    
  
        
        <Col xs={12} lg={6}>
        <label style={labelStyle}>Term Evaluation Results</label>
        <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={lists}
                  columns={columns}
               //  onCellEditStop={handleCellEditChange} // Attach the event handler
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
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
       
      </Row>
      
      </div>
      <ToastContainer 
style={{marginTop:"7%"}}  
position="top-center" 
autoClose={3000} />
    </>
  );
}
