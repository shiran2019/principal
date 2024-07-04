import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../helpers/AuthContext";

function AproveReq() {

    const [reqArray, setReqArray] = useState([]);

    const [authState, setAuthState] = useState({
        user: "",
        status: false,
        id: 0,
        role: "",
      });

 useEffect(() => {
    axios
      .get("http://localhost:3001/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data.role);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else if(response.data.role == "Student"){
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          })
        }
        else if(response.data.role == "Admin"){
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          })
        }else if(response.data.role == "Teacher"){
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          })
        }
        else console.log("fsgfgfg")
      });
  }, []);

useEffect(() => {
   
    const ShowRequests = async (x) => {
        console.log("StudentId" + x);
       await axios
          .get(`http://localhost:3001/appointmentRequest/${x}`)
          .then((response) => {
            setReqArray(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error("An error occurred:", error);
            setReqArray([]);
          });
      };
    
ShowRequests(authState.user);

    }, [authState.user]);








  return (

    <AuthContext.Provider value={{ authState, setAuthState }}>
    <Row style={{padding:"15px 10px"}}>
    {reqArray.map((requests) => (
        <Col xs={12} md={6} lg={3} style={{marginBottom:"10px"}} >
          <Card style={{backgroundColor:"#cbf5cb" , padding:"15px 10px",}}>
            <Card.Body> 
              <Card.Title>Teacher : {requests.fName}</Card.Title>
              <hr></hr>
              <Card.Text>
                          Reason : {requests.Note}
              </Card.Text>
              <Card.Text>
               {requests.Day}   /   {requests.time}     
              </Card.Text>
              <hr></hr>
              Check the Appointment calender to see your alocated time
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </AuthContext.Provider>
   
  );
}

export default AproveReq;

