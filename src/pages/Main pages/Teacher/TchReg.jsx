import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function TchReg() {
  const [divContent, setDivContent] = useState();
  const { id } = useParams();
  const [parents, setParents] = useState([]);
  const [newParentid, setNewParentid] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const updateDivContent = (content) => {
    setDivContent(content);
  };

  const initialValues = {
    studentId: "",
    fName: "",
    lName: "",
    fullname: "",
    gender: "",
    address: "",
    birthday: "",
    nation: "",
    religion: "",
    fatherName: "",
    fatherNIC: "",
    fatherNo: "",
    fatherEmail: "",
    motherName: "",
    motherNIC: "",
    motherNo: "",
    motherEmail: "",
    pNote: "",
  };

  const onSubmit = (data, { resetForm }) => {
    // Submit the parent data
    axios
      .post("http://localhost:3001/parents", data)
      .then((response) => {
        setSubmissionStatus("success");
        resetForm();

        // Fetch the last ParentId
        return axios.get("http://localhost:3001/parents/lastId");
      })
      .then((response) => {
        const lastParentId = response.data.id;
        console.log("Last Parent ID:", lastParentId);

        // Update the submitted Student row with the ParentId
        const studentData = { ...data, ParentId: lastParentId };
        return axios.post("http://localhost:3001/students", studentData);
      })
      .then(() => {
        setSubmissionStatus("success");
        resetForm();
        console.log("Student and parent data submitted successfully");
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
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
    padding: "10px 30px",
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

  const validateStudentId = (value) => {
    let error;
    if (!value) {
      error = "Student ID is required";
    } else if (value.length !== 6) {
      error = "Student ID should be 6 characters long";
    }
    return error;
  };

  const validateName = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      error = "Only letters are allowed";
    }
    return error;
  };

  const validateGender = (value) => {
    let error;
    if (!value) {
      error = "Gender is required";
    }
    return error;
  };

  const validateAddress = (value) => {
    let error;
    if (!value) {
      error = "Address is required";
    }
    return error;
  };

  const validateBirthday = (value) => {
    let error;
    if (!value) {
      error = "Birthday is required";
    }
    return error;
  };

  const validateNation = (value) => {
    let error;
    if (!value) {
      error = "Nationality is required";
    } else if (!/^[a-zA-Z]+$/.test(value)) {
      error = "Only letters are allowed";
    }
    return error;
  };

  const validateReligion = (value) => {
    let error;
    if (!value) {
      error = "Religion is required";
    } else if (!/^[a-zA-Z]+$/.test(value)) {
      error = "Only letters are allowed";
    }
    return error;
  };

  const validateParentName = (value) => {
    let error;
    if (!value) {
      error = "Parent Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      error = "Only letters and spaces are allowed";
    }
    return error;
  };

  const validateParentNIC = (value) => {
    let error;
    if (!value) {
      error = "Parent NIC is required";
    } else if (!/^[0-9]{9}[vVxX]$/.test(value)) {
      error = "Invalid NIC format";
    }
    return error;
  };

  const validateParentContactNo = (value) => {
    let error;
    if (!value) {
      error = "Contact No is required";
    } else if (!/^[0-9]{10}$/.test(value)) {
      error = "Invalid contact number format";
    }
    return error;
  };

  const validateParentEmail = (value) => {
    let error;
    if (!value) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }
    return error;
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form style={formStyle}>
          <center>
            {" "}
            <h2 style={{ paddingBottom: "10px" }}>Student Registration Form</h2>
          </center>

          <Row>
            <label style={labelStyle}>Student ID:</label>
            <Field
              id="inputCreatePost"
              name="studentId"
              placeholder="(Ex. 000001)"
              style={inputStyle}
              validate={validateStudentId}
            />
            <ErrorMessage
              name="studentId"
              component="div"
              style={{ color: "red" }}
            />
          </Row>
          <Row>
            <label style={labelStyle}>First Name:</label>
            <Field
              id="inputCreatePost"
              name="fName"
              placeholder="First Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="fName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <label style={labelStyle}>Last Name:</label>
            <Field
              id="inputCreatePost"
              name="lName"
              placeholder="Last Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="lName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>
          <Row>
            <label style={labelStyle}>Full Name:</label>
            <Field
              id="inputCreatePost"
              name="fullname"
              placeholder="Full Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="fullname"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <label style={labelStyle}>Address:</label>
            <Field
              id="inputCreatePost"
              name="address"
              placeholder="Address"
              style={inputStyle}
              validate={validateAddress}
            />
            <ErrorMessage
              name="address"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Gender:</label>
              <Field
                as="select"
                id="inputCreatePost"
                name="gender"
                style={inputStyle}
                validate={validateGender}
              >
                <option value="male">Select item</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Birthday:</label>
              <Field
                type="date"
                id="inputCreatePost"
                name="birthday"
                style={inputStyle}
                validate={validateBirthday}
              />
              <ErrorMessage
                name="birthday"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Race:</label>
              <Field
                id="inputCreatePost"
                name="nation"
                placeholder="Nationality"
                style={inputStyle}
                validate={validateNation}
              />
              <ErrorMessage
                name="nation"
                component="div"
                style={{ color: "red" }}
              />
            </Col>

            <Col xs={12} lg={6}>
              <label style={labelStyle}>Religion:</label>
              <Field
                id="inputCreatePost"
                name="religion"
                placeholder="Religion"
                style={inputStyle}
                validate={validateReligion}
              />
              <ErrorMessage
                name="religion"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

          <hr />
          <Row>
            <label style={labelStyle}>Father's Name:</label>
            <Field
              id="inputCreatePost"
              name="fatherName"
              placeholder="Father's Name"
              style={inputStyle}
              validate={validateParentName}
            />
            <ErrorMessage
              name="fatherName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Father's NIC:</label>
              <Field
                id="inputCreatePost"
                name="fatherNIC"
                placeholder="Father's NIC"
                style={inputStyle}
                validate={validateParentNIC}
              />
              <ErrorMessage
                name="fatherNIC"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Father's Contact No:</label>
              <Field
                id="inputCreatePost"
                name="fatherNo"
                placeholder="Father's Contact No"
                style={inputStyle}
                validate={validateParentContactNo}
              />
              <ErrorMessage
                name="fatherNo"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

          <Col>
            <label style={labelStyle}>Father's Email:</label>
            <Field
              id="inputCreatePost"
              name="fatherEmail"
              placeholder="Father's Email"
              style={inputStyle}
              validate={validateParentEmail}
            />
            <ErrorMessage
              name="fatherEmail"
              component="div"
              style={{ color: "red" }}
            />
          </Col>

          <hr />

          <Row>
            <label style={labelStyle}>Mother's Name:</label>
            <Field
              id="inputCreatePost"
              name="motherName"
              placeholder="Mother's Name"
              style={inputStyle}
              validate={validateParentName}
            />
            <ErrorMessage
              name="motherName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Mother's NIC:</label>
              <Field
                id="inputCreatePost"
                name="motherNIC"
                placeholder="Mother's NIC"
                style={inputStyle}
                validate={validateParentNIC}
              />
              <ErrorMessage
                name="motherNIC"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Mother's Contact No:</label>
              <Field
                id="inputCreatePost"
                name="motherNo"
                placeholder="Mother's Contact No"
                style={inputStyle}
                validate={validateParentContactNo}
              />
              <ErrorMessage
                name="motherNo"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <label style={labelStyle}>Mother's Email:</label>
              <Field
                id="inputCreatePost"
                name="motherEmail"
                placeholder="Mother's Email"
                style={inputStyle}
                validate={validateParentEmail}
              />
              <ErrorMessage
                name="motherEmail"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <label style={labelStyle}>Additional Notes:</label>
              <Field
                as="textarea"
                id="inputCreatePost"
                name="pNote"
                placeholder="Additional Notes"
                style={inputStyle}
              />
            </Col>
          </Row>

          <Row>
            {" "}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button type="submit" style={buttonStyle}>
                Submit
              </button>
            </div>
          </Row>
        </Form>
      </Formik>
    </div>
  );
}
