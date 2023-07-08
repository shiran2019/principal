
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
  const [idd, SetIdd] = useState("");
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
    teacherId: "",
    
  };

  const onSubmit = (data, resetForm, resetAllForms) => {
    axios
      .post("http://localhost:3001/TeacherAttendance", data)
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
    array.forEach((teacher) => {
      const data = {
        Attendance: attendance[teacher.teacherId], // Accessed the mark value from the marks object using the student ID
        Day:idd,
        teacherId: teacher.teacherId,
      };
      onSubmit(data, () => {}, () => {}); // Pass empty resetForm and resetAllForms functions as placeholders
    });
  };

  return (
    <>
    <h1>Teacher,</h1>
 <div><Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Row>
           
            <Col xs={12} lg={4}>
              <label style={labelStyle}>Date:</label>
              <Field
                type="date"
                id="inputCreatePost"
                name="Day"
                style={inputStyle}
                value={idd}
               //validate={validateBirthday}
               onChange={(e) => SetIdd(e.target.value)}
               
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
                        as="select" // Render the field as a select dropdown
                        id="inputCreatePost"

                        name={`Attendance[${teacher.teacherId}]`}
                        style={{ width:"120px", height: "30px"}}
                     //  validate={validate3}
                        value={attendance[teacher.teacherId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [teacher.teacherId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
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