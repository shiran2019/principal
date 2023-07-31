import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl } from "react-bootstrap";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [idd, SetIdd] = useState(
    new Date().toLocaleDateString("en-US").substr(0, 10)
  );
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null);

  const initialValues = {
    Attendance: "",
    Day: "",
    StudentId: "",
  };

  const onSubmit = (data, resetForm, resetAllForms) => {
    axios
      .post("http://localhost:3001/StudentAttendance", data)
      .then((response) => {
        console.log(response.data.error);

        if (
          response.data.error ===
          "Attendance for the given student and day already exists."
        ) {
         
        
          document.getElementById("btnn").style.backgroundColor = "#910a1a";
          document.getElementById("btnn").innerHTML = "Data already exist";
        } else {
          setSubmissionStatus("success");
          document.getElementById("btnn").style.backgroundColor = "#1b8c37";
          document.getElementById("btnn").innerHTML = "Submitted";
          resetForm();
          
        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
       
        toast.error("Error: " + error.message);
      })
      .finally(() => {
        resetAllForms();
      });
  };

  useEffect(() => {
    document.getElementById("btnn").style.backgroundColor = "#007bff";
    document.getElementById("btnn").innerHTML = "Submit";
    handleSearch();

  }, [searchTerm]);

  const handleSearch = () => {
    axios
      .get(`http://localhost:3001/students/class/${searchTerm}`)
      .then((response) => {
        setFilteredTableArray(response.data);
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
    padding: "8px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "right",
  };

  const formStyle = {
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const handleAddAll = () => {
    const missingAttendanceStudents = [];

    filteredTableArray.forEach((student) => {
      if (!attendance[student.StudentId]) {
        missingAttendanceStudents.push(student.StudentId);
      }
    });

    if (missingAttendanceStudents.length > 0) {
    
      toast.warn( "Please mark attendance for the following students: " +
      missingAttendanceStudents.join(", "));
      return;
    }

    filteredTableArray.forEach((student) => {
      const data = {
        Attendance: attendance[student.StudentId],
        Day: idd,
        StudentId: student.StudentId,
      };
      onSubmit(data, () => {}, () => {});
    });
  };

  return (
    <>
      <h1>Student,</h1>
      <div>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Row>
              <Col xs={12} lg={6}>
                <label style={labelStyle}>Search Class Room:</label>
                <FormControl
                  type="text"
                  placeholder="Search Class name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
              <Col xs={12} lg={6}>
                <label style={labelStyle}>Date:</label>
                <Field
                  editable={false}
                  id="inputCreatePost"
                  name="Day"
                  style={inputStyle}
                  value={idd}
                />
                <ErrorMessage
                  name="Day"
                  component="div"
                  style={{ color: "red" }}
                />
              </Col>
            </Row>
            <Row>
              <Table style={formStyle}>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>First Name</th>
                    <th>Note</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableArray.map((student, index) => (
                    <tr key={student.StudentId}>
                      <td>{student.StudentId}</td>
                      <td>{student.fName}</td>
                      <td>{student.pNote}</td>

                      <td>
                        <Field
                          as="select"
                          id="inputCreatePost"
                          name={`Attendance[${student.StudentId}]`}
                          style={{ width: "120px", height: "30px" }}
                          value={attendance[student.StudentId] || ""}
                          onChange={(e) =>
                            setAttendance({
                              ...attendance,
                              [student.StudentId]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </Field>
                        <ErrorMessage
                          name={`Attendance[${student.StudentId}]`}
                          component="div"
                          style={{ color: "red" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <button
              id="btnn"
                type="button"
                style={buttonStyle}
                onClick={handleAddAll}
              >
                Add All
              </button>
            </Row>
          </Form>
        </Formik>
      </div>
      
<ToastContainer 
style={{marginTop:"7%"}}  
position="top-center" 
autoClose={3000} />

    </>
  );
};

export default Attendance;
