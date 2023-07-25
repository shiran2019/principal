import { Formik, Form, Field, ErrorMessage } from "formik";
import NavigationBar from '../../../components/Navbar'
import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from "axios";
import { storage } from "../../../Firebase";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "@firebase/storage";

export const Announcement = () => {

    const [reqArray, setReqArray] = useState([]);
    const [idd, SetIdd] = useState(new Date().toLocaleDateString("en-US").substr(0, 10));

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageId, setImageId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");

    const [regYear, setRegYear] = useState("");
    
    const onSubmit = (data, { resetForm }) => {

        const data1 = {
          ...data,
          state: "active",
          Day: idd,
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
       


        const fileChangeHandler = (e) => {
          setSelectedFile(e.target.files[0]);
        };
      
        const formSubmitHandler = async (e) => {
          e.preventDefault();
          if (selectedFile) {
            uploadFile(selectedFile);
          } else {
            console.log("No file selected.");
            alert("No file selected.");
          }
        };

        const uploadFile = (file) => {
          // const imageId = generateImageId(studenttId);
          // setImageId(imageId);
          if (!regYear) {
            alert("Please select a registration year.");
            return;
          }

          const storageRef = ref(storage, `report/${regYear}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
        
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(prog);
            },
            (error) => console.log(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((url) => {
                  setImageUrl(url);
                  console.log(url);
                  alert("File uploaded successfully");
                  setSelectedFile(null); // Clear the selected file
                  
      
                })
                .catch((error) => console.log(error));
            }
          );
        };
        
 const retrieveImage = () => {
    if (regYear) {
      const storageRef = ref(storage, `report/${regYear}`);
      listAll(storageRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef)
              .then((url) => {
                setImageUrl(url);
                console.log(url);

              })
              .catch((error) => console.log(error));
          });
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No File ID found.");
    }
  };

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

  const buttonStyles = {
    marginTop: "10px",
    padding: "6px 20px",
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

  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Fill the field";
    }
    return error;
  };

  function renderYearOptions() {
    const currentYear = new Date().getFullYear() + 5;
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

  return (

    <>
    <div>
        <NavigationBar />
    </div>
    <div style={{paddingRight:"5%"}}>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form>
               
                <Row>
               
                  <Col lg ={7}>
                <Row style={{padding:"0px  10%"}}>
                <h3 style={{ marginBottom:"20px"}}>Add Announcement, </h3>
            <Col xs={12} lg={6}>
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
                    validate={validate3}
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
                <Col xs={12} lg={6}>
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
                    editable={false}
                    name="Day"
                    className="form-control"
                    value= {idd}
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

              
                <Col xs={12} lg={12}>
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
                    validate={validate3}
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
                    <Col lg={12}>
                <hr style={{marginTop:"10px"}}></hr>
                </Col>

                </Row>
                </Col>
                <Col lg ={5}>
                <h3 style={{  marginBottom:"20px"}}>Upload Annual plan, </h3>
                <Row style={{backgroundColor:"#c8cccc"}}>


                <Col xs={12} lg={8} >
              <label style={labelStyle}>Year:</label>
              <Field
                as="select"
                id="inputCreatePost"
                name="regyear"
                style={inputStyle}
                onChange={(e) => setRegYear(e.target.value)}
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
            <label style={labelStyle}>Upload annual plan :   </label>
                <Col xs={12} lg={6}>
                     
                   
                   <input type="file"  className="input" onChange={fileChangeHandler} />

                   </Col>
                    <Col xs={12} lg={6}>
                    <h6>Uploaded {progress} %</h6>
                    </Col>
                    <Col xs={12} lg={12}>
                  <button style={buttonStyles} onClick={formSubmitHandler}>Upload</button>
            
              
            
              {imageUrl && (
           <div>
             <a href={imageUrl} download>
               Download File
             </a>
           </div>
         )}
                 
                           </Col>
                            <Col xs={12} lg={12}>
                              <h1></h1>
                              </Col>

                </Row>
                
                
                
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
