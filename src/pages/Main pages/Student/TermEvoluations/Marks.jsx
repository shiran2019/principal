import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl } from "react-bootstrap";

export default function Marks() {
  const [marks, setMarks] = useState({}); // Updated marks state
  const [idd, SetIdd] = useState("");
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null); // Added allSubmissionStatus state

  const initialValues = {
    Mark: "",
    CreateEvoId: "",
    StudentId: "",
  };

  const onSubmit = (data, resetForm, resetAllForms) => {
    axios
      .post("http://localhost:3001/termEvoluations", data)
      .then((response) => {
        setSubmissionStatus("success");
        resetForm();
        //setMarks({}); // Reset the marks object
        alert("Added new class successfully");
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
      .get("http://localhost:3001/createEvoluations/evo")
      .then((response) => {
        setArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

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
    // maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const validate1 = (value) => {
    let error;
    if (!idd) {
      error = "Type is required";
    }
    return error;
  };

  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Mark is required";
    }
    return error;
  };

  const handleAddAll = () => {
    // Iterate over each student and submit their marks
    filteredTableArray.forEach((student) => {
      const data = {
        Mark: marks[student.studentId], // Accessed the mark value from the marks object using the student ID
        CreateEvoId: parseInt(idd),
        StudentId: student.studentId,
      };
      onSubmit(data, () => {}, () => {}); // Pass empty resetForm and resetAllForms functions as placeholders
    });
  };

  return (
    <>
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
              <label style={labelStyle}>Type:</label>
              <Field
                as="select"
                id="inputCreatePost"
                name="CreateEvoId"
                style={inputStyle}
                validate={validate1}
                value={temp}
                placeholder={temp}
                onChange={(e) => {
                  const selectedEvoType = e.target.value;
                  setTemp(selectedEvoType);
                  const selectedEvo = array.find(
                    (item) => item.EvoType === selectedEvoType
                  );
                  SetIdd(selectedEvo ? selectedEvo.id : "");
                }}
              >
                <option value="">Select Type</option>
                {array.map((item) => {
                  if (item.EvoType !== idd) {
                    return (
                      <option key={item.EvoType} value={item.EvoType}>
                        {item.EvoType}
                      </option>
                    );
                  }
                  return null;
                })}
              </Field>

              <ErrorMessage
                name="CreateEvoId"
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
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableArray.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.fName}</td>
                    <td>{student.pNote}</td>
                    <td>
                      <Field
                        as="select" // Render the field as a select dropdown
                        id="inputCreatePost"

                        name={`Mark[${student.studentId}]`}
                        style={{ width:"120px", height: "30px"}}
                        validate={validate3}
                        value={marks[student.studentId] || ""} // Accessed the mark value from the marks object using the student ID
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [student.studentId]: e.target.value, // Updated the specific mark value in the marks object using the student ID
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="very bad">Very Bad</option>
                        <option value="bad">Bad</option>
                        <option value="medium">Medium</option>
                        <option value="good">Good</option>
                        <option value="very good">Very Good</option>
                      </Field>

                      <ErrorMessage
                        name={`Mark[${student.studentId}]`}
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
    </>
  );
}
