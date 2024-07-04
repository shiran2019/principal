import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { PieChart } from '@mui/x-charts/PieChart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminProf = () => {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwd3, setPwd3] = useState("");
  const [classCountArray, setClassCountArray] = useState([]);
  const [yearCountArray, setYearCountArray] = useState([]);
  const [adminCountArray, setAdminCountArray] = useState([]);
 const [chartarr, setChartarr] = useState([]);
 const [chartarrr, setChartarrr] = useState([]);

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
  const buttonStylex = {
    padding: "10px 40px",
    backgroundColor: "#f59e42",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
    marginLeft: "10px",
  };

  const onSubmit = (data, { resetForm }) => {
    const { password, confirmPassword } = data;
    const submitData = {
      ...data,
      role: "Admin",
    };

    if (password !== confirmPassword) {
     
      toast.warn("Passwords do not match")
      return;
    }
    axios
      .post("http://localhost:3001/users", submitData)
      .then((response) => {
        resetForm();
      
        toast.success("Done")
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

      const respons = await axios.get(`http://localhost:3001/students/yearCount`);
      const classCountDat = respons.data;
  
      const chartDat = classCountDat.map((item) => ({
        value: item.count,
        label: item.regyear
      }));
      const respon = await axios.get(`http://localhost:3001/users/admins`);
      const classCountDa = respon.data;
  
      const chartDa = classCountDa.map((item) => ({
        value: item.count,
        label: item.regyear
      }));
      setAdminCountArray(classCountDa);
      setChartarrr(chartDa);
  
      setClassCountArray(classCountData);
      setYearCountArray(classCountDat);
      setChartarr(chartData);
      setChartarrr(chartDat);
      
    } catch (error) {
      console.error("An error occurred:", error);
    } 
  };



  return (
    <>
      <div className="App">
        <NavigationBar />
      </div>
      <div style={{marginLeft:"5%"}}>
<a href="#sec1">
<button style={buttonStylex}>
Student counts
</button></a>
<a href="#sec2">
<button style={buttonStylex}>
Student payments 
</button></a>
<a href="#sec3">
<button style={buttonStylex}>

Add another Admin 
</button></a>

</div>
<hr></hr>
      <div id ="sec1"  style={{marginLeft:"6%" , marginRight:"5%"}}>
      <h2 style={{   marginBottom: "2%",}}>STUDENT COUNT</h2>
        <Row style={{backgroundColor:"#c8cccc", borderRadius:"15px"}}>
       
       
          <Col lg={6}>
          <h4 style={{ marginBottom: "10%" }}>According to the Registration year :</h4>
            <Table>
                <thead>
                  <tr>
                    <th>Registration year</th>
                    <th>Student count</th>
                  </tr>
                </thead>
                <tbody>
                  {yearCountArray.map((item) => (
                    <tr key={item.regyear}>
                      <td>{item.regyear}</td>
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
          data: chartarrr,
        },
      ]}
      width={400}
      height={200}
    />
          </Col>
        </Row>
        <hr></hr>
        <Row style={{backgroundColor:"#c8cccc" , borderRadius:"15px"}}>
          <Col lg={6}>
            <h4 style={{ marginBottom: "10%" }}>According to the Class room :</h4>
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
      <Row>

<Col>

<Col id = "sec2" style={{padding:"5% 5%"}}>
<h2 >Student payments</h2>
  <div style={{ border:"3px solid #00000030" , borderRadius:"15px"}}>
         
  <iframe title="dash2" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=99d3b4c3-b6dc-41b9-a90d-17096131524b&autoAuth=true&ctid=aa232db2-7a78-4414-a529-33db9124cba7" frameborder="0" allowFullScreen="true"></iframe>
          </div>
          </Col>
</Col>

      </Row>
<hr></hr>
<div id ="sec3">
      <Row style={{  padding: "0% 10%" }}>
        <Col lg={4}>
        <h2 style={{ marginBottom: "10%" }}>Add another Admin</h2>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <Row>
              <label style={labelStyle}>User name:</label>
              <Field
                id="inputCreatePost"
                name="user"
                placeholder=" Enter user name"
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
        </Col>
        <Col lg={4} style={{marginLeft:"5%", marginTop:"4%"}}>
        <h4 style={{ marginBottom: "10%" }}></h4>
            <Table>
                <thead>
                  <tr>
                    <th>Admins</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {adminCountArray.map((item) => (
                    <tr key={item.user}>
                      <td>{item.user}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </Table>
          </Col>
        
      </Row>
      </div>
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    </>
  );
};
