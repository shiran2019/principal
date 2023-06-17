import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

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
    TeacherTeacherId: "",
  };

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://localhost:3001/classes", data)
      .then((response) => {
        setSubmissionStatus("success");
        resetForm();
        tableData();
        alert("Added new class successfully");
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
        alert("Error : ");
      });
  };

  const tableData = () => {
    axios
    .get(`http://localhost:3001/classes/clsDetails`)
    .then((response) => {
      setClassArray(response.data);
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

  return (
    <>
      <div>
        <Row>

          <Col lg={12}>
          <center>
                {" "}
                <h2 style={{ paddingBottom: "10px" }}>Teacher allocations</h2>
              </center>

            <Table style={formStyle}>
              <thead>
                <tr>
                  <th>Class name</th>
                  <th>Teacher ID</th>
                </tr>
              </thead>
              <tbody>
                {clsaaArray.map((item) => (
                  <tr key={item.className}>
                    <td>{item.className}</td>
                    <td>{item.TeacherTeacherId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
                <Col xs={12} lg={6}>
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
                    name="TeacherTeacherId"
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
                    name="TeacherTeacherId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Row>
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
    </>
  );
}
