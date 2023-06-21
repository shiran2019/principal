import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TermEvo() {
  const [teacherArray, setTeacherArray] = useState([]);
  const [tableArray, setTableArray] = useState([]);
  const { id } = useParams();
  const [parents, setParents] = useState([]);
  const [newParentid, setNewParentid] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [teacherrId, setTeacherrId] = useState("");

  const initialValues = {
    EvoType: "",
    Activity: "",
    Day: "",
    Note: "",
  };

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://localhost:3001/createEvoluations", data)
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
    .get(`http://localhost:3001/createEvoluations`)
    .then((response) => {
      setTableArray(response.data);
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
    padding: "20px ",
    border: "1px solid #ddd",
    borderRadius: "4px",
   // maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const validate1 = (value) => {
    let error;
    if (!value) {
      error = "Type is required";

      return error;
    }
  };

  const validate2 = (value) => {
    let error;
    if (!value) {
      error = "Details are required";

      return error;
    }
  };

  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Activity is required";

      return error;
    }
  };
  return (
    <>
      <div style={{padding:"1px 20px"}}>
       
       
        {/* <hr style={{margin: "20px 0" ,height:"5px", backgroundColor:"#5b5ea6"}} /> */}
  

          <Row >
            

          <Col lg={7} xs={12}>
          <center>
                {" "}
                <h2 style={{ paddingBottom: "10px" }}>Evoluation types</h2>
              </center>

            <Table style={formStyle}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evoluation</th>
                  <th>Activity</th>
                  <th>Day</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {tableArray.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.EvoType}</td>
                    <td>{item.Activity}</td>
                    <td>{item.Day}</td>
                    <td>{item.Note}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{marginTop:"2%"}}>
          <Col lg={7} xs={12}>
          <center>
                {" "}
                <h2 style={{ paddingBottom: "10px" }}>Add new Evoluation type</h2>
              </center>

          <Formik
            initialValues={{
              ...initialValues,
            }}
            onSubmit={onSubmit}
          >
            <Form style={formStyle}>
          
              <Row >
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Type :</label>
                  <Field
                    id="inputCreatePost"
                    name="EvoType"
                    // placeholder="class name"
                    style={inputStyle}
                    validate={validate1}
                  />
                  <ErrorMessage
                    name="EvoType"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Activity:</label>
                  <Field
                    id="inputCreatePost"
                    name="Activity"
                    style={inputStyle}
                    validate={validate3}
                  >
                  
                  </Field>
                  <ErrorMessage
                    name="Note"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col>
              <label style={labelStyle}>Date:</label>
              <Field
                type="date"
                id="inputCreatePost"
                name="Day"
                style={inputStyle}
                //validate={validatRegDay}
              />
              <ErrorMessage
                name="Day"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Details:</label>
                  <Field
                     as="textarea"
                    id="inputCreatePost"
                    name="Note"
                    style={inputStyle}
                    validate={validate2}
                  >
                  
                  </Field>
                  <ErrorMessage
                    name="Note"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Row>
                

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
        
          </Col>

          </Row>
      </div>
    </>
  );
}
