
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl } from "react-bootstrap";



export default function AddPayment() {

  const [Payment, setPayment] = useState({});
  const [Month, setMonth] = useState({}); // Updated marks state
  const [Day, setDay] = useState({}); // Updated marks state
  const [Note, setNote] = useState({}); // Updated marks state

  
  const [idd, SetIdd] = useState("");
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null); // Added allSubmissionStatus state

  const initialValues = {
    Day: "",
    Month: "",
    StudentId: "",
    Payment: "",
    Note: "",
   
  };

  const onSubmit = (data, resetForm, resetAllForms) => {



    console.log(data);
    axios
      .post("http://localhost:3001/StudentPayment", data)
      .then((response) => {
       
        setSubmissionStatus("success");
        resetForm();
        alert("Added new class successfully");
        //setMarks({}); // Reset the marks object
       
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





  const handleAddAll = () => {
    // Iterate over each student and submit their marks
    filteredTableArray.forEach((student) => {
      const data = {
       
        Month: Month[student.StudentId],
        Day: Day[student.StudentId],
        Note: Note[student.StudentId],
        StudentId: student.StudentId,
        Payment: Payment[student.StudentId],
      };
      onSubmit(data, () => {}, () => {}); // Pass empty resetForm and resetAllForms functions as placeholders
    });
  };

  return (
 <>
 
         <div style={{maxWidth:"100%" , marginLeft:"1%"}}>
         <h1 >Add Student Payments,</h1>
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
           
          </Row>
          <Row >
           
            <Table style={formStyle} >
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>First Name</th>
                    <th>Note</th>
                    <th>Payment</th>
                  <th>Month</th>
                  <th>day</th>
                  <th>Payment Note</th>
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
               
                        id="inputCreatePost"
                        name={`Payment[${student.StudentId}]`}
                        style={{ width:"120px", height: "30px"}}
                       // validate={validate3}
                        value={Payment[student.StudentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setPayment({
                            ...Payment,
                            [student.StudentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
                          })
                        }
                      >
                       
                      </Field>

                      <ErrorMessage
                        name={`Payment[${student.StudentId}]`}
                        component="div"
                        style={{ color: "red" }}
                      />
                    </td>




                    <td>
                      <Field
                        as="select" // Render the field as a select dropdown
                        id="inputCreatePost"

                        name={`Month[${student.StudentId}]`}
                        style={{ width:"120px", height: "30px"}}
                       // validate={validate3}
                        value={Month[student.StudentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setMonth({
                            ...Month,
                            [student.StudentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="Octomber">Octomber</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                      </Field>

                      <ErrorMessage
                        name={`Month[${student.StudentId}]`}
                        component="div"
                        style={{ color: "red" }}
                      />
                    </td>
                    
                    <td>
                    <Field
               
                        id="inputCreatePost"
                        type ="Date"
                        name={`Day[${student.StudentId}]`}
                        style={{ width:"120px", height: "30px"}}
                       // validate={validate3}
                        value={Day[student.StudentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setDay({
                            ...Day,
                            [student.StudentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
                          })
                        }
                      >
                       
                      </Field>

                      <ErrorMessage
                        name={`Day[${student.StudentId}]`}
                        component="div"
                        style={{ color: "red" }}
                      />
                    </td>
                    <td>
                    <Field
               as="textarea"
                        id="inputCreatePost"
                        name={`Note[${student.StudentId}]`}
                        style={{ width:"120px", height: "30px"}}
                       // validate={validate3}
                        value={Note[student.StudentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setNote({
                            ...Note,
                            [student.StudentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
                          })
                        }
                      >
                       
                      </Field>

                      <ErrorMessage
                        name={`Note[${student.StudentId}]`}
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
      </Formik>
       </div>
     
      </>
  );
}
