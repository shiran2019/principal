
import NavigationBar from '../../../../components/Navbar'
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from "axios";
import { AuthContext } from "../../../../helpers/AuthContext";

export const DisplayAnnouncement = () => {
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
            } else if (response.data.role == "Student") {
              setAuthState({
                user: response.data.user,
                status: true,
                id: 1,
                role: response.data.role,
              });
            } else if (response.data.role == "Admin") {
              setAuthState({
                user: response.data.user,
                status: true,
                id: 2,
                role: response.data.role,
              });
            } else if (response.data.role == "Teacher") {
              setAuthState({
                user: response.data.user,
                status: true,
                id: 3,
                role: response.data.role,
              });
            } else console.log("fsgfgfg");
          });
          ShowRequests();
      }, []);
    
      useEffect(() => {
            ShowRequests();
        }, [authState.role]);
       

            const ShowRequests = () => {
                axios
                  .get(`http://localhost:3001/announcements/role/${authState.role}`)
                  .then((response) => {
                    setReqArray(response.data);
                  })
                  .catch((error) => {
                    console.error("An error occurred:", error);
                  });
              };


  return (

    <>
    <div><NavigationBar/></div>
    <div>
    <h2 style={{padding:"25px  10%" , marginBottom:"20px"}}>Today Announcements, </h2>
    <Row style={{padding:"0px  10%"}}>
    {reqArray.map((requests) => (
        <Col xs={12} md={6} lg={3}
        style={{marginBottom:"15px"}} >
          <Card style={{backgroundColor:"#cbf5cb"}}>
            <Card.Body> 
             
              <Card.Text>
                         <h5> Announcement :</h5>
              </Card.Text>
              <Card.Text>
                        {requests.Note}
              </Card.Text>
              <Card.Text>
               {requests.Day}        
              </Card.Text>
              
              
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    </div>
    </>
   
  )
}
