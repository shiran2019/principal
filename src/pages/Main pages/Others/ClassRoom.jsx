import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../../components/Navbar";
import Box from '@mui/material/Box';
import { DataGrid ,GridToolbar} from '@mui/x-data-grid';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const columns = [
  { field: 'ClassId', headerName: 'ID', width: 250},
  {
    field: 'teacherId',
    headerName: 'teacher Id',
    width: 250,
    editable: false,
  },
  
   {
    field: 'className',
    headerName: 'Class room',
    width: 250,
    editable: true,
   
  
  },
];

export default function ClsAdd() {
  const [teacherArray, setTeacherArray] = useState([]);
  const [clsaaArray, setClassArray] = useState([]);
  const [divContent, setDivContent] = useState();
  const { id } = useParams();
  const [parents, setParents] = useState([]);
  const [newParentid, setNewParentid] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [teacherrId, setTeacherrId] = useState("");

  const initialValues = {
    className: "",
    teacherId: "",
  };

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://localhost:3001/classes", data)
      .then((response) => {
        setSubmissionStatus("success");
        resetForm();
        tableData();
        toast.success("done");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          
          toast.warn("Teacher already asigned");
        } else {
          console.log(error);
          setSubmissionStatus("error");
          
          toast.error("Data not submitted");

        }
      });
  };
  
  const tableData = () => {
    axios
    .get(`http://localhost:3001/classes/clsDetails`)
    .then((response) => {
      
      const modifiedData = response.data.map((row) => ({
        ...row,
        id: row.ClassId, // Set `EvoId` as the `id` property
      }));
     setClassArray(modifiedData);
     console.log(modifiedData);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/teachers/tch`)
      .then((response) => {
        setTeacherArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

      tableData();
  }, []);

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
    maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const validate = (value) => {
    let error;
    if (!value) {
      error = "Class name is required";

      return error;
    }
  };

  const mySaveOnServerFunction = (params) => {
    

    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/classes/upd/${params.ClassId}`,params )
      .then((response) => {
        toast.success("Updated");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
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
     <div className="App">
        <NavigationBar />
      </div>
      <div>
<a href="#sec1">
<button style={buttonStylex}>
Teacher allocations
</button></a>
<a href="#sec2">
<button style={buttonStylex}>
Add new Class room
</button></a>
</div>
<hr></hr>
      <div id ="sec1">
        <Row>
        <center>
                {" "}
                <h2  style={{ paddingBottom: "10px" }}>Teacher allocations for class room</h2>
              </center>
          <Col  lg={10} style={{paddingLeft:"19%"}}>
         

         <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={clsaaArray}
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
       
        {/* <hr style={{margin: "20px 0" ,height:"5px", backgroundColor:"#5b5ea6"}} /> */}
        <Row style={{marginTop:"2%"}}>
          <Formik
            initialValues={{
              ...initialValues,
            }}
            onSubmit={onSubmit}
          >
            <Form style={formStyle}>
              <center>
                {" "}
                <h2 style={{ paddingBottom: "10px" }}>Add new class</h2>
              </center>

              <Row >
                <Col id ="sec2" xs={12} lg={6}>
                  <label style={labelStyle}>Class Name :</label>
                  <Field
                    id="inputCreatePost"
                    name="className"
                    // placeholder="class name"
                    style={inputStyle}
                    validate={validate}
                  />
                  <ErrorMessage
                    name="className"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Teacher Id:</label>
                  <Field
                    as="select"
                    id="inputCreatePost"
                    name="teacherId"
                    style={inputStyle}
                    // validate={validateclass}
                  >
                    <option value="">Select item</option>
                    {teacherArray.map((item) => (
                      <option key={item.teacherId} value={item.teacherId}>
                        {item.teacherId}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="teacherId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Row >
                  <Col lg={6}>
                    <Table>
                      <thead>
                        <tr>
                          <th>Teacher Name</th>
                          <th>Teacher ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherArray.map((item) => (
                          <tr key={item.teacherId}>
                            <td>{item.fName}</td>
                            <td>{item.teacherId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>

                  <Col>
                  {" "}
                <div
                  style={{
                    textAlign: "right",
                   // marginTop: "5%",
                    align: "right",
                  }}
                >
                  <button type="submit" style={buttonStyle}>
                    Add
                  </button>
                </div>
                  </Col>
                </Row>
              </Row>
              
            </Form>
          </Formik>
        </Row>
      </div>
      <ToastContainer 
style={{marginTop:"7%"}}  
position="top-center" 
autoClose={3000} />

    </>
  );
}
