import React, { useState, useEffect } from 'react';
import NavigationBar from '../../../../components/Navbar';
import axios from "axios";
import { AuthContext } from "../../../../helpers/AuthContext";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../../../Firebase";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pr from "../../../..//images/pr.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Annualreport } from '../../Annualreport';

export default function TchProfile() {
  const [stdArray, setStdArray] = useState([]);
  const [clsArray, setClsArray] = useState([]);
  
  const [imageUrls, setImageUrls] = useState({});
  const [authState, setAuthState] = useState({
    user: "",
    status: false,
    id: 0,
    role: "",
  });


  const labelStyle = {
    marginBottom: "8px",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const pStyle = {
    marginBottom: "8px",
    fontSize: "20px",
    fontWeight: "bold",
    color:"#5b5ea6"
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
    //maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };
 
  useEffect(() => {

    const fetchAuthData = async () => {
      

      try {
        const response = await axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        localStorage.setItem("user", response.data.user);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else if (response.data.role === "Student") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role === "Admin") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role === "Teacher") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else {
          console.log("Invalid role:", response.data.role);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchAuthData();
  }, []);

  const retrieveImage = async (id) => {
    if (id) {
      const storageRef = ref(storage, `images/${id}`);
      try {
        const res = await listAll(storageRef);
        if (res.items.length > 0) {
          const itemRef = res.items[0];
          try {
            const url = await getDownloadURL(itemRef);
            setImageUrls((prevUrls) => ({
              ...prevUrls,
              [id]: url,
            }));
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("No image found for ID:", id);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No image ID found.");
    }
    StudentDet(localStorage.getItem("user"));
  };

 
  const StudentDet = async (x) => {
    
   
       
   await axios
    .get(`http://localhost:3001/teachers/byTeacherId/${x}`)
    .then((response) => {
    setStdArray(response.data);
    console.log(stdArray);
    console.log(response.data.className);
    return axios.get(`http://localhost:3001/students/StdCount/${response.data.className}`)
    })
    .then((response) => {
      console.log(response.data.classCount);
      setClsArray(response.data);

    })
    .catch((error) => { 
      console.log(error);
    }
    );
  
   
   
};
  

  useEffect(() => {
    const fetchData = async () => {
      await retrieveImage(authState.user);
      await StudentDet(authState.user);
    };

    fetchData();
  }, [authState.user]); // Added authState.user as a dependency

  useEffect(() => {
    if (localStorage.getItem("user")) {
      retrieveImage(localStorage.getItem("user"));
      StudentDet(localStorage.getItem("user"));
    }
  }, []); // Run when the component mounts
  return (
    <>
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="App">
        <NavigationBar />
      </div>

      <div style={{ padding: "0px 50px" }}>
        <Row>
          <Col lg={2} xs={8}>
            {/* Conditional rendering for profile picture */}
            {imageUrls ? (
              <Card
                onClick={() => retrieveImage(authState.user)}
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "10%",
                  backgroundColor: "#ababab",
                }}
              >
                <Card.Img
                  variant="top"
                  src={imageUrls[authState.user]}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              </Card>
            ) : (
              <div>Loading...</div>
            )}
          </Col>
          <Col lg={6} xs={12}>
           
            {stdArray ? (
              <>
                <h1 style={{ marginTop: "14%" }}> {stdArray.fName} </h1>
                <h3> {stdArray.lName} </h3>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </Col>
          
          <Col style={{backgroundColor:"#c8cccc" , borderRadius:"2%" }} lg={4}>
          <Annualreport/>
          </Col>
        </Row>
        
       
          
              <Formik>
            <Form style={formStyle}>
            {stdArray ? (
              <>
                <Row>
            <p style={pStyle}>TEACHER DETAILS</p>
            <hr></hr>
            <Col lg={6} xs={12}>
              <p style={{fontSize:"20px"}}>Full name : {stdArray.fullname} </p>
              <p style={{fontSize:"20px"}}>NIC    :  {stdArray.teacherNIC} </p>
              <p style={{fontSize:"20px"}}>Address : {stdArray.address} </p>
              <p style={{fontSize:"20px"}}>Register date : {stdArray.regDate} </p>
             
              </Col>
              <Col lg={6} xs={12}>
              <p style={{fontSize:"20px"}}>Mobile no : {stdArray.teacherNo} </p>
              <p style={{fontSize:"20px"}}>Email : {stdArray.teacherEmail} </p>
          
              </Col>
              </Row>

              </>
            ) : (
              <div>Loading...</div>
            )}

              </Form>
              </Formik>

             


            <Formik>
            <Form style={formStyle}>
            <Row>
            <p style={pStyle}>CLASS DETAILS</p>
            <hr></hr>
            <Col lg={6} xs={12}>

            
            {stdArray  ? (
              <>
                 <p style={{fontSize:"20px"}}>Class : {stdArray.className} </p>
             
              </>
            ) : (
              <div>Loading...</div>
            )}
              {clsArray  ? (
              <>
                 <p style={{fontSize:"20px"}}>Student Count : {clsArray.classCount} </p>
             
              </>
            ) : (
              <div>Loading...</div>
            )}
             
</Col>
              </Row>
              </Form>
              </Formik>
    
     
    
        </div>
      </AuthContext.Provider>
    </>
  );
}
