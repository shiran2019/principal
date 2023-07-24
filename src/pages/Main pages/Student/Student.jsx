import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'StudentId',
    headerName: 'Student Id',
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
    field: 'gender',
    headerName: 'Gender',
    width: 150,
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
    width: 110,
  },
];

export default function StdTable() {
  const [stdArray, setStdArray] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/students/studentList`)
      .then((response) => {
        setStdArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const mySaveOnServerFunction = (params) => {
    alert("The changed value is: ");
    


    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/students/upd/${params.StudentId}`,params )
      .then((response) => {
        alert("done");
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
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={stdArray}
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
          </center>
        </Row>
      </div>
    </>
  );
}
