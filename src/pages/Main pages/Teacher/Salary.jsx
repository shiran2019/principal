import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import DownloadPDFButton from "../../../components/PDFgenerator";


import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../../components/Navbar";
//import { use } from "../../../../../Server/routes/Students";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Salary() {

  const currentDate = new Date().toLocaleDateString("en-US");

  const [teacherArray, setTeacherArray] = useState([]);

  const { id } = useParams();
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [teacherrId, setTeacherrId] = useState("");

  const [epfRate, setEpfRate] = useState("");
  const [basic, setBasic] = useState("");
  const [allowance, setAllowance] = useState("");
  const [salary, setSalary] = useState("");

  const [classNameArray, setClassNametArray] = useState("");
  const [countArray, setCountArray] = useState([]);

  const [month, setMonth] = useState("");

  const [pdfValues, setPdfValues] = useState({});

 


  const StoreEPF = () => {
    if (epfRate) {
      localStorage.setItem("epfRate", epfRate);
    }
  };

  const StoreAllowance = () => {
    if (allowance) {
      localStorage.setItem("allowance", allowance);
    }
  };

  const StoreBasic = () => {
    if (basic) {
      localStorage.setItem("basic", basic);
    }
  };

  useEffect(() => {
    
    setEpfRate(localStorage.getItem("epfRate"));
    setAllowance(localStorage.getItem("allowance"));
    setBasic(localStorage.getItem("basic"));
    console.log(currentDate);
  }, []);

  useEffect(() => {
    StoreEPF();
    StoreBasic();
    StoreAllowance();
  }, [basic, allowance, epfRate]);

  const initialValues = {
    teacherId: "",
    Day: "",
    Month: "",
    Salary: "",
    StdCount: "",
    epfRate: "",
    Allowance: "",
    Basic: "",
  };

  const onSubmit = (data, { resetForm }) => {

    setMonth(data.Month);
 



    const data1 = {
      ...data,
      epfRate: epfRate,
      Allowance: allowance,
      Basic: basic,
      Salary: salary,
      teacherId: teacherrId,
      Day:currentDate,
      Month:month,
    };

   
    axios
      .post("http://localhost:3001/teacherSalary", data1)
      .then((response) => {
        setSubmissionStatus("success");
        resetForm();
        setSalary(0);
      
        toast.info("Click Download button to download the salary receipt")
      })
      .then((response) => {
        PdfGen();
        
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
         
          toast.warn("This data already exists")
        } else {
          console.log(error);
          setSubmissionStatus("error");
    
          toast.warn("Data not submitted")
        }
      });
  };

  const onPageCount = () => {
    axios
      .get(`http://localhost:3001/students/StdCount/${classNameArray}`)
      .then((response) => {
        setCountArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/classes/clsDetails`)
      .then((response) => {
        setTeacherArray(response.data);
        //  console.log(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  useEffect(() => {
    onPageCount();
    
  }, [classNameArray]);

  useEffect(() => {
    const sal = parseInt(basic) + parseInt(allowance) - (parseInt(basic) * parseInt(epfRate)) / 100;
    setSalary(sal);
 
}, [basic, allowance, epfRate, month, teacherrId])


const PdfGen = () => {
  // const doc = new jsPDF();
  // doc.text("Salary Receipt", 80, 10);
  // doc.text("Teacher Id   : " + teacherrId, 20, 30);

  // doc.text("Salary Month : " + month, 20, 50);
  // doc.text("Basic Salary : " + basic, 20, 60);
  // doc.text("Allowance    : " + allowance, 20, 70);
  // doc.text("EPF Rate     : " + epfRate, 20, 80);
  // doc.text("---------------------------------------" , 20, 90);
  // doc.text("Total Salary : " + salary, 20, 100);
  // doc.text("---------------------------------------" , 20, 110);
 
  // doc.text("Signature of the Principal" , 20, 140); 
  // doc.text("Date: " + currentDate, 100, 140);
  // doc.text("--------------------------" , 20, 150);
  // doc.save("Salary Receipt"+"_"+teacherrId+"_"+month+".pdf");

 const Values = {
  teacherId: teacherrId,
  Month: month,
  Basic: basic,
  Allowance: allowance,
  epfRate: epfRate,
  Salary: salary,
  Day: currentDate,
 };

 setPdfValues(Values);


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

  const validate = (values) => {
    if (!teacherrId) {
      return "Required";
    }
  };

  const validateBasic = () => {
    if (!basic) {
      return "Required";
    }
    if (isNaN(basic)) {
      return "basic must be a valid number";
    }
  
    return null; // Return null if validation passes
  };

  const validateAllowance = () => {
    if (!allowance) {
      return "Required";
    }
    if (isNaN(allowance)) {
      return "allowance must be a valid number";
    }
  
    return null; // Return null if validation passes
  };
  const validateEPF = () => {
    if (!epfRate) {
      return "Required";
    }
    
    if (isNaN(epfRate)) {
      return "EPF rate must be a valid number";
    }
  
    return null; // Return null if validation passes
  };

  const validateSalary = (salary) => {
    
    if (isNaN(salary)) {
      return "Salary must be a valid number";
    }
  
    return null; // Return null if validation passes
  };

  const validateMonth = () => {
    if(!month){
      return "Required";
    }
  };
  return (
    <>
      <div>
        <div className="App">
          <NavigationBar />
        </div>
      </div>
      <div>
        {/* <hr style={{margin: "20px 0" ,height:"5px", backgroundColor:"#5b5ea6"}} /> */}
        <Row style={{ marginTop: "2%" }}>
          <Formik
            initialValues={{
              ...initialValues,
            }}
            onSubmit={onSubmit}
          >
            <Form style={formStyle}>
              <center>
                {" "}
                <h2 style={{ paddingBottom: "10px" }}>
                  Teacher Salary calculater,
                </h2>
              </center>

              <Row>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Teacher Id:</label>
                  <Field
                    as="select"
                    id="inputCreatePost"
                    name="teacherId"
                    value={teacherrId}
                    validate={validate}
                    style={inputStyle}
                    onChange={(e) => {
                      const teacherId = e.target.value;
                      const teacher = teacherArray.find(
                        (item) => item.teacherId === teacherId
                      );
                      if (teacher) {
                        setTeacherrId(teacherId);
                        setClassNametArray(teacher.className);
                      }
                    }}
                  >
                    <option value="">Select item</option>
                    {teacherArray.map((item) => (
                      <option key={item.teacherId} value={item.teacherId}>
                        {item.teacherId}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="teacherId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Student Count :</label>
                  <Field
                    id="inputCreatePost"
                    name="StdCount"
                    // placeholder="class name"
                    style={inputStyle}
                    readOnly={true}
                    value={countArray.classCount}
                  />
                  <ErrorMessage
                    name="StdCount"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col xs={12} lg={6}>
      <label style={labelStyle}>Date:</label>
      <Field
       // type="date"
        id="inputCreatePost"
        name="Day"
        readOnly={true}
        style={inputStyle}
       // validate={validate}
       // defaultValue={currentDate}
        value={currentDate}
      />
      <ErrorMessage name="Day" component="div" style={{ color: "red" }} />
    </Col>


                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Month:</label>
                  <Field
                    id="inputCreatePost"
                    name="Month"
                    component="select" // Use the select component
                    style={inputStyle}
                    validate={validateMonth}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Select a month</option>
                    option
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
                    name="Month"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <hr
                  style={{
                    margin: "20px 0",
                    height: "5px",
                    backgroundColor: "#5b5ea6",
                  }}
                />
                <Col xs={12} lg={4}>
                  <label style={labelStyle}>Basic Salary : Rs.</label>
                  <Field
                    id="inputCreatePost"
                    name="Basic"
                    // placeholder="class name"
                    style={inputStyle}
                    validate={validateBasic}
                    value={basic}
                    onChange={(e) => setBasic(e.target.value)}
                  />
                  <ErrorMessage
                    name="Basic"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col xs={12} lg={4}>
                  <label style={labelStyle}>Allowance : Rs.</label>
                  <Field
                    id="inputCreatePost"
                    name="Allowance"
                    // placeholder="class name"
                    style={inputStyle}
                    validate={validateAllowance}
                    value={allowance}
                    onChange={(e) => setAllowance(e.target.value)}
                  />
                  <ErrorMessage
                    name="Allowance"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>

                <Col xs={12} lg={4}>
                  <label style={labelStyle}>EPF rate : %</label>
                  <Field
                    id="inputCreatePost"
                    name="epfRate"
                    // placeholder="class name"
                    style={inputStyle}
                    validate={validateEPF}
                    value={epfRate}
                    onChange={(e) => setEpfRate(e.target.value)}
                  />
                  <ErrorMessage
                    name="epfRate"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <hr
                  style={{
                    margin: "20px 0",
                    height: "5px",
                    backgroundColor: "#5b5ea6",
                  }}
                />
                <Row>
                  <Col xs={12} lg={6}>
                    <label style={labelStyle}>Salary :</label>
                    <Field
                      id="inputCreatePost"
                      name="Salary"
                      readOnly={true}
                      // placeholder="class name"
                      style={inputStyle}
                      validate={validateSalary}
                      value={salary}
                    />
                    <ErrorMessage
                      name="Salary"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                  <Col>
                    {" "}
                    <div
                      style={{
                        textAlign: "right",
                        marginTop: "7%",
                        align: "right",
                      }}
                    >
                    
                    </div>
                  </Col>
                </Row>
                <hr
                  style={{
                    margin: "20px 0",
                    height: "5px",
                    backgroundColor: "#5b5ea6",
                  }}
                />
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
                      <button  style={buttonStyle}>
                        Submit 
                      </button>
                      <DownloadPDFButton values={pdfValues} />  
                    </div>
                  </Col>
                </Row>
              </Row>
            
            </Form>
          </Formik>
 
        </Row>
      </div>
      <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
    </>
  );
}
