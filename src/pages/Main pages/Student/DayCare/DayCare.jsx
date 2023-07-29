import React from "react";
import NavigationBar from "../../../../components/Navbar";
import bg from "../../../../images/s.jpg";
import { Row, Col, Alert } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";




export const DayCare = () => {

  const [studentArray, setStudentArray] = useState([]);


useEffect( ()  => {
  Load();
}, []);

useEffect( ()  => {
  Load();
}, []);

const Load = (data) => {
  axios
  .get(`http://localhost:3001/students/daycare/${localStorage.getItem("user")}`)
  .then((response) => {

    console.log(response.data);

    setStudentArray(response.data);

    
  })
  .catch((error) => {
    console.log(error);
  });
};


  const initialValues = {
    dayCare: "",
  };

  const mySaveOnServerFunction = (data) => {
    
    // Make an API call to update the changed value in the database
    axios
      .put(`http://localhost:3001/students/upd/${localStorage.getItem("user")}`,data )
      .then((response) => {
        alert("done");
        Load();
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

  const noteStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "italic",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "5px",
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
    marginTop: "20px",
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
      error = "select a option";
    }
    return error;
  };



  return (
    <>
      <div>
        <NavigationBar />
      </div>
      <div
        style={{
          border: "0px solid",
          marginTop: "-4%",
          position: "fixed",
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.659), rgba(0, 0, 0, 0.664)), url("${bg}")`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Row>
          <Col xs={12} style={{ paddingTop: "10%" }}>
            <Formik initialValues={initialValues} onSubmit={mySaveOnServerFunction}> 
              <Form style={formStyle}>
                <label style={labelStyle}>
                  Afternoon Care Arrangement for the Chield :
                </label>
                <Field
                  as="select"
                  id="inputCreatePost"
                  style={inputStyle}
                  name="dayCare"
                  validate={validate}
                >
                  <option value="">Select</option>
                  <option value="DayCare">Day Care</option>
                  <option value="Pickup by Guardian">Pickup by Guardian</option>
                </Field>{" "}
                <ErrorMessage
                  name="dayCare"
                  component="div"
                  style={{ color: "red" }}
                />
                <button type="submit" style={buttonStyle}>
                  Update
                </button>

               {studentArray.map((val) => {
                  return (
                    <div>
                      <p style={noteStyle}>
                        <strong>Note : </strong> Your current selection is{"     "}
                        <strong style={{color:"green", fontSize:"20px"}}>{val.dayCare}</strong>
                      </p>
                    </div>
                  );
                })
               }
               <div style={{borderRadius:"15px" , backgroundColor:"#c8cccc" , height:"200px"}}> 
               <strong style={{ fontSize:"30px" ,paddingTop:"20px", paddingLeft:"10px"}}> For your child safety ,</strong>
              
               <p style={{paddingTop:"10px", paddingLeft:"10px" , fontSize:"17px"}}>If you want to keep your chield in Daycare after the Pre-School , Select {" "} <strong> "Daycare"</strong> option </p>
               <p style={{paddingTop:"5px", paddingLeft:"10px" , fontSize:"17px"}}>We will hand over your chield to the guardien only when {" "} <strong> "Pickup by Guardien"</strong> option is selected on this form </p>
               <p style={{paddingTop:"5px", paddingLeft:"10px" , fontSize:"17px"}}> Contact No : 0XX XXX XXXX </p>
               </div>

              
              </Form>
            </Formik>
          </Col>
        </Row>
      </div>
    </>
  );
};
