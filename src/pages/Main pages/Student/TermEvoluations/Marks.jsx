import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl } from "react-bootstrap";

export default function Marks() {
  const [marks, setMarks] = useState({});
  const [idd, SetIdd] = useState("");
  const [array, setArray] = useState([]);
  const [temp, setTemp] = useState("");
  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [allSubmissionStatus, setAllSubmissionStatus] = useState(null);

  const initialValues = {
    Mark: "",
    EvoId: "",
    StudetId: "",
    id: "",
  };

  const onSubmit = (data, resetForm, resetAllForms, student) => {
    console.log(data);

    if (isNaN(data.EvoId)) {
      alert("Please select a Term Evaluation");
      return;
    }

    axios
      .post("http://localhost:3001/termEvoluations", data)
      .then((response) => {
        if (response.data.error) {
          setSubmissionStatus("error");
          alert(response.data.error);

          // Update the submission status for the specific student
          setFilteredTableArray(prevTable => prevTable.map(s => {
            if (s.StudentId === student.StudentId) {
              return { ...s, submissionStatus: "error" };
            }
            return s;
          }));
        } else {
          setSubmissionStatus("success");
          resetForm();
          alert("Added marks successfully");

          // Update the submission status for the specific student
          setFilteredTableArray(prevTable => prevTable.map(s => {
            if (s.StudentId === student.StudentId) {
              return { ...s, submissionStatus: "success" };
            }
            return s;
          }));
        }
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
        alert("Error: " + error.message);
      })
      .finally(() => {
        resetAllForms();
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

  const handleAddAll = () => {
    filteredTableArray.forEach((student) => {
      const data = {
        Mark: marks[student.StudentId],
        EvoId: parseInt(idd),
        StudentId: student.StudentId,
      };
      onSubmit(data, () => {}, () => {}, student);
    });
  };

  // New function to handle submitting marks for an individual student
  const handleAdd = (student) => {
    const mark = marks[student.StudentId];
    if (mark === null || mark === undefined || mark.trim() === "") {
      alert(`Marks for Student ID ${student.StudentId} is required.`);
      return;
    }

    const data = {
      id: student.id,
      Mark: mark,
      EvoId: parseInt(idd),
      StudentId: student.StudentId,
    };

    onSubmit(data, () => {}, () => {}, student);
  };

  return (
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
              name="EvoId"
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
                SetIdd(selectedEvo ? selectedEvo.EvoId : "");
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
        <Row>
          <Table style={formStyle}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Note</th>
                <th>Marks</th>
                <th>Actions</th>
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
                      name={`Mark[${student.StudentId}]`}
                      style={{ width: "120px", height: "30px" }}
                      value={marks[student.StudentId] || ""}
                      onChange={(e) =>
                        setMarks({
                          ...marks,
                          [student.StudentId]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="Need to improve">Need to improve</option>
                      <option value="medium">Medium</option>
                      <option value="good">Good</option>
                      <option value="very good">Very Good</option>
                    </Field>

                    <ErrorMessage
                      name={`Mark[${student.StudentId}]`}
                      component="div"
                      style={{ color: "red" }}
                    />
                  </td>
                  <td>
                    <Button
                      id={toString(student.id)}
                      onClick={() => handleAdd(student)}
                      style={{
                        backgroundColor:
                          student.submissionStatus === "success"
                            ? "#1b8c37"
                            : student.submissionStatus === "error"
                            ? "#910a1a"
                            : "#007bff",
                        color: "#fff",
                        padding: "8px 10px",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                        textAlign: "right",
                      }}
                    >
                      {student.submissionStatus === "success"
                        ? "Submitted"
                        : student.submissionStatus === "error"
                        ? "Check data and Retry"
                        : "Submit"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Form>
    </Formik>
  );
}
