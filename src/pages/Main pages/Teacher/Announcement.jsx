import { Formik, Form, Field, ErrorMessage } from "formik";
import NavigationBar from '../../../components/Navbar'
import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from "axios";


export const Announcement = () => {

    const [reqArray, setReqArray] = useState([]);
    

    
    const onSubmit = (data, { resetForm }) => {

        const data1 = {
          ...data,
          state: "active",
        };
        console.log(data1);
        axios
        .post("http://localhost:3001/announcements", data1)
        .then((response) => {
          alert("Added new class successfully");
          resetForm();
          ShowRequests();
          
        })
        .catch((error) => {
          console.log(error);
        });
        };

        useEffect(() => {
            ShowRequests();
        }, []);
       

            const ShowRequests = () => {
                axios
                  .get(`http://localhost:3001/announcements`)
                  .then((response) => {
                    setReqArray(response.data);
                  })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });
              };
        
              const DeleteCard = (x) => {
                axios
                  .delete(`http://localhost:3001/announcements/ann/${x}`)
                  .then((response) => {
                    alert("Deleted successfully");
                    ShowRequests();
                  })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });
              };
    const initialValues = {
        role: "",
        Day: "",
        state: "",
        Note: "",
        
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

  const buttonStyle2 = {
    padding: "8px 20px",
    backgroundColor: "#fa4362",
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



  return (

    <>
    <div>
        <NavigationBar />
    </div>
    <div>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form>
                <h1 style={{padding:"0px  10%" , marginBottom:"20px"}}>Add Announcement, </h1>
                <Row style={{padding:"0px  10%"}}>
            <Col xs={12} lg={4}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Announcement for :
                  </label>
                  <Field
                    id="inputCreatePost"
                    name="role"
                    component="select" // Use the select component
                    style={inputStyle}
                    //validate={validateMonth}
                    //value={month}
                    
                  >
                    <option value="">Select a role</option>
                    option
                    <option value="Student">Student ( for parent )</option>
                    <option value="Teacher">Teacher</option>
               
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={4}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Date :
                  </label>
                  <Field
                    type="date"
                    name="Day"
                    className="form-control"
                    style={{
                      padding: "10px",
                      marginBottom: "50px",
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="Day"
                    component="span"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={8}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Announcement:
                  </label>
                  <Field
                    as="textarea"
                    name="Note"
                    className="form-control"
                    style={{
                      padding: "10px",
                      marginBottom: "50px",
                      width: "100%",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                  <ErrorMessage
                    name="Note"
                    component="span"
                    style={{ color: "red" }}
                  />
                </Col>

               
                </Row>
                <Row style={{padding:"0px  10%"}}>
                <Col>
                <button type="submit" style={buttonStyle}>
                    Submit
                    </button>
                </Col>
                </Row>
                <Row style={{padding:"0px  10%"}}>
                    <Col lg={8}>
                <hr style={{marginTop:"10px"}}></hr>
                </Col>

                </Row>

                </Form>
        </Formik>


    </div>
    <div>
    <h2 style={{padding:"25px  10%" , marginBottom:"20px"}}>Today Announcements, </h2>
    <Row style={{padding:"0px  10%"}}>
    {reqArray.map((requests) => (
        <Col xs={12} md={6} lg={3}
        style={{marginBottom:"15px"}} >
          <Card 
          style={{backgroundColor:"#cbf5cb"}}
          >
            <Card.Body> 
              <Card.Title>Role : {requests.role}</Card.Title>
              <hr></hr>
              <Card.Text>
                          Announcement : {requests.Note}
              </Card.Text>
              <Card.Text>
               {requests.Day}        
              </Card.Text>
              <button style={buttonStyle2} onClick={()=> DeleteCard(requests.id)}>Delete</button>
              
              
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    </div>

    </>
  )
}
