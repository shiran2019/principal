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
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null);

  const initialValues = {
    Attendance: "",
    Day: "",
    teacherId: "",
  };

  const onSubmit = (data, resetForm, resetAllForms) => {
    axios
      .post("http://localhost:3001/TeacherAttendance", data)
      .then((response) => {
        console.log(response.data.error);

        if (response.data.error) {
         
          document.getElementById("btnn").style.backgroundColor = "#910a1a";
          document.getElementById("btnn").innerHTML = "Data already exist";
        } else {
          document.getElementById("btnn").style.backgroundColor = "#1b8c37";
          document.getElementById("btnn").innerHTML = "Submitted";
          resetForm();
          
        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
        
        toast.warn("Error: " + error.message);
      })
      .finally(() => {
        resetAllForms();
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/teachers/teacherList")
      .then((response) => {
        setArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
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

  const validate3 = () => {
    let error;
    if (!idd) {
      error = "Day is required";
    }
    return error;
  };

  const handleAddAll = () => {
    const missingAttendanceTeachers = [];

    array.forEach((teacher) => {
      if (!attendance[teacher.teacherId]) {
        missingAttendanceTeachers.push(teacher.teacherId);
      }
    });

    if (missingAttendanceTeachers.length > 0) {
    
      toast.warn("Please mark attendance for the following teachers: " +
      missingAttendanceTeachers.join(", "));
      return;
    }

    array.forEach((teacher) => {
      const data = {
        Attendance: attendance[teacher.teacherId],
        Day: idd,
        teacherId: teacher.teacherId,
      };
      onSubmit(data, () => {}, () => {});
    });
  };

  return (
    <>
      <h1>Teacher,</h1>
      <div>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Row>
              <Col xs={12} lg={4}>
                <label style={labelStyle}>Date:</label>
                <Field
                  editable={false}
                  id="inputCreatePost"
                  name="Day"
                  style={inputStyle}
                  value={idd}
                  validate={validate3}
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
                    <th>Teacher ID</th>
                    <th>First Name</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {array.map((teacher, index) => (
                    <tr key={teacher.teacherId}>
                      <td>{teacher.teacherId}</td>
                      <td>{teacher.fName}</td>
                      <td>
                        <Field
                          as="select"
                          id="inputCreatePost"
                          name={`Attendance[${teacher.teacherId}]`}
                          style={{ width: "120px", height: "30px" }}
                          value={attendance[teacher.teacherId] || ""}
                          onChange={(e) =>
                            setAttendance({
                              ...attendance,
                              [teacher.teacherId]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </Field>
                        <ErrorMessage
                          name={`Attendance[${teacher.teacherId}]`}
                          component="div"
                          style={{ color: "red" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <button
              id ="btnn"
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
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
    </>
  );
};

export default Attendance;
