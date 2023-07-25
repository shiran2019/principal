
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl } from "react-bootstrap";


const Attendance = () => {
  const [attendance, setAttendance] = useState({}); // Updated marks state
  const [idd, SetIdd] = useState(new Date().toLocaleDateString("en-US").substr(0, 10));
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null); // Added allSubmissionStatus state
  

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

        if(response.data.error==="Attendance for the given student and day already exists."){
          alert("Attendance already added for this student on this day");}
        else{
        setSubmissionStatus("success");
        resetForm();
        alert("Added new class successfully");
        //setMarks({}); // Reset the marks object
        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
        alert("Error: " + error.message);
      })
      .finally(() => {
       
        resetAllForms(); // Reset all the forms after submission
      });
  };


  useEffect(() => {
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
    //maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };


  // const validate3 = (idd) => {
  //   let error;
  //   if (!idd) {
  //     error = "Type is required";
  //   }
  //   return error;
  // };

  const handleAddAll = () => {
    // Iterate over each student and submit their marks




    filteredTableArray.forEach((student) => {

      if(!attendance[student.StudentId]){
        alert("Please mark attendance for " +student.StudentId);
      return;
      }
      
      const data = {
        Attendance: attendance[student.StudentId], // Accessed the mark value from the marks object using the student ID
        Day:idd,
        StudentId: student.StudentId,
      };
      onSubmit(data, () => {}, () => {}); // Pass empty resetForm and resetAllForms functions as placeholders
    });
  };

  return (
    <>
    <h1>Student,</h1>
 <div><Formik initialValues={initialValues} onSubmit={onSubmit}>
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
               //validate={validateBirthday}
              // onChange={(e) => SetIdd(e.target.value)}
               
              />
              <ErrorMessage
                name="Day"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
           
          </Row>
          <Row >
           
            <Table style={formStyle} >
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
                        as="select" // Render the field as a select dropdown
                        id="inputCreatePost"

                        name={`Attendance[${student.StudentId}]`}
                        style={{ width:"120px", height: "30px"}}
                     //  validate={validate3}
                        value={attendance[student.StudentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [student.StudentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
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
              type="button"
              style={buttonStyle}
              onClick={handleAddAll} // Call handleAddAll function on button click
            >
              Add All
            </button>
         
          </Row>
        </Form>
      </Formik></div>
      </>
  );
}
export default Attendance