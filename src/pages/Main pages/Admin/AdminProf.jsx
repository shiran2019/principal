import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { PieChart } from '@mui/x-charts/PieChart';

export const AdminProf = () => {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwd3, setPwd3] = useState("");
  const [classCountArray, setClassCountArray] = useState([]);

 const [chartarr, setChartarr] = useState([]);

 useEffect(() => {
   onPageCount();
   
 }, []);

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const noteStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "italic",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "20px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const initialValues = {
    user: "",
    password: "",
    confirmPassword: "",
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
  const onSubmit = (data, { resetForm }) => {
    const { password, confirmPassword } = data;
    const submitData = {
      ...data,
      role: "Admin",
    };

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    axios
      .post("http://localhost:3001/users", submitData)
      .then((response) => {
        resetForm();
        alert("Added new class successfully");
      })
      .catch((error) => {
        console.log(error);
      });
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

  const validatePwd = (value) => {
    let error;
    if (!value) {
      error = "Password is required";
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6}$/.test(value)) {
      error =
        "Password should be 6 characters long and should contain numbers and letters";
    }
    return error;
  };

  const checkPwd = (value) => {
    let error;
    if (pwd1 !== pwd2) {
      error = "Passwords do not match";
    } else {
      setPwd3(pwd2);
    }
    return error;
  };

  const onPageCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/students/classCount`);
      const classCountData = response.data;
  
      const chartData = classCountData.map((item) => ({
        value: item.count,
        label: item.className
      }));
  
      setClassCountArray(classCountData);
      setChartarr(chartData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };



  return (
    <>
      <div className="App">
        <NavigationBar />
      </div>
      <div  >
        <Row>
          <Col lg={6}>
            <h2 style={{ marginBottom: "10%" }}>Student Count :</h2>
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
          <Col lg={6} style={{ padding: "6% 0%" }}>
          <PieChart
      series={[
        {
          data: chartarr,
        },
      ]}
      width={400}
      height={200}
    />
          </Col>
        </Row>
       
      </div>
      <hr></hr>
      <div style={{ maxWidth: "50%", padding: "0% 10%" }}>
        <h2 style={{ marginBottom: "10%" }}>Add another Admin</h2>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Row>
              <label style={labelStyle}>User name:</label>
              <Field
                id="inputCreatePost"
                name="user"
                placeholder="Father's Name"
                style={inputStyle}
                validate={validateParentName}
              />
              <ErrorMessage
                name="user"
                component="div"
                style={{ color: "red" }}
              />
            </Row>
            <Row>
              <label style={labelStyle}>Password:</label>
              <Field
                type="password"
                id="inputCreatePost"
                name="password"
                placeholder="Password"
                style={inputStyle}
                validate={validatePwd}
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: "red" }}
              />
            </Row>
            <Row>
              <label style={labelStyle}>Confirm Password:</label>
              <Field
                type="password"
                id="inputCreatePost"
                name="confirmPassword"
                placeholder="Confirm Password"
                style={inputStyle}
                validate={checkPwd}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                style={{ color: "red" }}
              />
            </Row>
            <button style={buttonStyle} type="submit">
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
};
