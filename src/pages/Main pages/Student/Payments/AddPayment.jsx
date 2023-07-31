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


export default function AddPayment() {
  const [Payment, setPayment] = useState({});
  const [Month, setMonth] = useState({});
  const [Day, setDay] = useState({});
  const [Note, setNote] = useState({});
  const [idd, SetIdd] = useState(new Date().toLocaleDateString("en-US").substr(0, 10));
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null);

  const initialValues = {
    Day: "",
    Month: "",
    StudentId: "",
    Payment: "",
    Note: "",
  };

  const onSubmit = async (data) => {
    await axios
      .post("http://localhost:3001/StudentPayment", data)
      .then((response) => {
        if (!response.data.error) {
          // Update the button style after successful submission
          document.getElementById(data.StudentId).style.backgroundColor = "#1b8c37";
          document.getElementById(data.StudentId).innerHTML = "Submitted";
        } else {
          // Update the button style after submission error
          document.getElementById(data.StudentId).style.backgroundColor = "#910a1a";
          document.getElementById(data.StudentId).innerHTML = "Data already exist";
        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    handleSearch2();
  }, [searchTerm2]);

  const handleSearch = () => {
    axios
      .get(`http://localhost:3001/students/class/${searchTerm}`)
      .then((response) => {
        setFilteredTableArray(response.data);
      })
      .catch((error) => {
       // console.error("An error occurred:", error);
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

  const handleSearch2 = () => {
    if (searchTerm2 === "") {
      setFilteredTableArray(array);
      return;
    }

    const filteredData = filteredTableArray.filter((item) =>
      item.fName.toLowerCase().includes(searchTerm2.toLowerCase())
    );
    setFilteredTableArray(filteredData);
  };

  const handleAddRow = (studentId) => {
    const paymentValue = Payment[studentId];
    const monthValue = Month[studentId];
    const noteValue = Note[studentId];

    if (isNaN(paymentValue) || paymentValue === "" || Number(paymentValue) <= 0) {
     
      toast.warn(`Please fill a valid positive number in the Payment cell for Student ID: ${studentId}`);
      return;
   
    }
    if (!monthValue) {
     
      toast.warn(`Please select a month for Student ID: ${studentId}`);
      return;
    }

    const rowData = {
      Month: monthValue,
      Day: idd,
      Note: noteValue,
      StudentId: studentId,
      Payment: paymentValue,
    };

    onSubmit(rowData);
  };

  const isSubmitDisabled = (studentId) => {
    const paymentValue = Payment[studentId];
    const monthValue = Month[studentId];
    return !/^\d+$/.test(paymentValue) || !monthValue || Number(paymentValue) <= 0;
  };

  return (
    <>
      <div style={{ maxWidth: "100%", marginLeft: "1%" }}>
        <h1>Add Student Payments</h1>
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
                <label style={labelStyle}>Search by first name:</label>
                <FormControl
                  type="text"
                  placeholder="Search by first name"
                  value={searchTerm2}
                  onChange={(e) => setSearchTerm2(e.target.value)}
                  style={{ marginBottom: "20px" }}
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
                    <th>Payment</th>
                    <th>Month</th>
                    <th>Day</th>
                    <th>Payment Note</th>
                    <th>Submit</th>
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
                          style={{ width: "120px", height: "30px" }}
                          value={Payment[student.StudentId] || ""}
                          onChange={(e) =>
                            setPayment({
                              ...Payment,
                              [student.StudentId]: e.target.value,
                            })
                          }
                        ></Field>

                        <ErrorMessage
                          name={`Payment[${student.StudentId}]`}
                          component="div"
                          style={{ color: "red" }}
                        />
                      </td>

                      <td>
                        <Field
                          as="select"
                          id="inputCreatePost"
                          name={`Month[${student.StudentId}]`}
                          style={{ width: "120px", height: "30px" }}
                          value={Month[student.StudentId] || ""}
                          onChange={(e) =>
                            setMonth({
                              ...Month,
                              [student.StudentId]: e.target.value,
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
                          <option value="October">October</option>
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
                          editable={false}
                          id="inputCreatePost"
                          name={`Day`}
                          style={{ width: "120px", height: "30px" }}
                          value={idd}
                        ></Field>

                        <ErrorMessage
                          name={`Day`}
                          component="div"
                          style={{ color: "red" }}
                        />
                      </td>

                      <td>
                        <Field
                          as="textarea"
                          id="inputCreatePost"
                          name={`Note[${student.StudentId}]`}
                          style={{ width: "120px", height: "30px" }}
                          value={Note[student.StudentId] || ""}
                          onChange={(e) =>
                            setNote({
                              ...Note,
                              [student.StudentId]: e.target.value,
                            })
                          }
                        ></Field>

                        <ErrorMessage
                          name={`Note[${student.StudentId}]`}
                          component="div"
                          style={{ color: "red" }}
                        />
                      </td>

                      <td>
                        <button
                          id={student.StudentId}
                          style={{
                            padding: "8px 10px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                          onClick={() => handleAddRow(student.StudentId)}
                          disabled={isSubmitDisabled(student.StudentId)}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
}
