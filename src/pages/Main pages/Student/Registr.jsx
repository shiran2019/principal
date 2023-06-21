import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage} from "formik";
import axios, { isAxiosError } from "axios";
import { Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StdReg() {
  const [classCountArray, setClassCountArray] = useState([]);
  const [classArray, setClassArray] = useState([]);

  const [divContent, setDivContent] = useState();

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [studenttId, setStudenttId] = useState("PD000001");

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
    motherName: "",
    motherNIC: "",
    motherNo: "",
    pNote: "",
    ClassClassName: "",
    regyear: "",
  };

  const onSubmit = (data, { resetForm }) => {

    if (data.motherNIC === data.fatherNIC) {
      alert("Mother's NIC and Father's NIC cannot be the same");
      return; // Stop execution if the NICs are the same
    }
    axios
      .post("http://localhost:3001/parents", data)
      .then((response) => {
        setSubmissionStatus("success");
        // resetForm();

        return axios.get("http://localhost:3001/parents/lastId");
      })
      .then((response) => {
        const lastParentId = response.data.id;
        console.log("Last Parent ID:", lastParentId);

        const studentData = {
          ...data,
          ParentId: lastParentId,
          studentId: studenttId,
        };
        return axios.post("http://localhost:3001/students", studentData);
      })
      .then(() => {
        setSubmissionStatus("success");
        resetForm();
        onPageRefresh();
        onPageCount();
        console.log("Student and parent data submitted successfully");
        alert("Student Id :" + String(studenttId) + " submitted successfully");
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
        alert("Error : ");
      });
  };

  const onPageRefresh = () => {
    axios
      .get("http://localhost:3001/students/lastId")
      .then((response) => {
        const lastId = response.data.id;
        const lastIdSuffix = lastId.slice(-6);
        const lastIdNumber = parseInt(lastIdSuffix, 10);
        let newIdNumber;

        if (isNaN(lastIdNumber)) {
          // If the table is empty or lastIdNumber is not a number
          newIdNumber = 1;
        } else {
          newIdNumber = lastIdNumber + 1;
        }

        const newIdString = "PD" + String(newIdNumber).padStart(6, "0");
        setStudenttId(newIdString); // Set the studentId state with the newIdString value

        // Additional logic on page refresh
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onPageCount = () => {
    axios
      .get(`http://localhost:3001/students/classCount`)
      .then((response) => {
        setClassCountArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/classes/cls`)
      .then((response) => {
        setClassArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });

    onPageRefresh();
    onPageCount();
  }, []);


  function renderYearOptions() {
    const currentYear = new Date().getFullYear()+5;
    const years = [];
  

    // Generate options for the last 10 years (adjust as needed)
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
  
    return years;
  }  


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

  // const validateStudentId = (value) => {
  //   let error;
  //   if (!value) {
  //     error = "Student ID is required";
  //   } else if (value.length !== 6) {
  //     error = "Student ID should be 6 characters long";
  //   }
  //   return error;
  // };

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
  const validateclass = (value) => {
    let error;
    if (!value) {
      error = "Class room is required";
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
    } else {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      if (selectedDate > tomorrow) {
        error = "Birthday cannot be a future date";
      }
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

  const validateFathertNIC = (value) => {
    let error;
    if (!value) {
      error = "Parent NIC is required";
    } else if (!/^[0-9]{9}[vV]$/.test(value)) {
      error = "Invalid NIC format";
    }
    return error;
  };

  const validateMotherNIC = (value, allValues) => {
    let error;
    if (!value) {
      error = "Parent NIC is required";
    } else if (!/^[0-9]{9}[vV]$/.test(value)) {
      error = "Invalid NIC format";
    } else if (allValues && allValues.fatherNIC && value === allValues.motherNIC) {
      error = "Father's and Mother's NIC cannot be the same";
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

  return (
    <div>
      <Formik
        initialValues={{
          studentId: studenttId,
          inputId: studenttId,
          ...initialValues,
        }}
        onSubmit={onSubmit}
      >
        <Form style={formStyle}>
          <center>
            {" "}
            <h2 style={{ paddingBottom: "10px" }}>Student Registration Form</h2>
          </center>

          <Row>
            <label style={labelStyle}>Student ID:</label>
            <Field
              id="inputId"
              name="studentId"
              placeholder={studenttId}
              style={inputStyle}
              readOnly={true}
              //validate={validateStudentId}
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
                <option value="">Select item</option>
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
                validate={validateFathertNIC}
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
                validate={validateMotherNIC}
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

          <Row></Row>
          <hr />
          <Row>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Class room:</label>
              <Field
                as="select"
                id="inputCreatePost"
                name="ClassClassName"
                style={inputStyle}
                validate={validateclass}
              >
                <option value="">Select item</option>

                {classArray.map((classItem) => (
                  <option key={classItem.className} value={classItem.className}>
                    {classItem.className}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="ClassClassName"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
           
          
            <Col xs={12} lg={6}>

            <label style={labelStyle}>Registration Year:</label>
            <Field
              as="select"
              id="inputCreatePost"
              name="regyear"
              style={inputStyle}
             // validate={validateRegistrationYear}
            >
              <option value="">Select Year</option>
              {renderYearOptions()}
            </Field>
            <ErrorMessage
              name="regyear"
              component="div"
              style={{ color: "red" }}
            />
            </Col>
          </Row>
          <Row>
            {" "}
            <Col lg={6}>
              <Table>
                <thead>
                  <tr>
                    <th>Class name</th>
                    <th>Student count</th>
                  </tr>
                </thead>
                <tbody>
                  {classCountArray.map((item) => (
                    <tr key={item.className}>
                      <td>{item.className}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
