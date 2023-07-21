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

export default function TchProfile() {
  return (
    <>
   
      <div className="App">
        <NavigationBar />
      </div>
      <div>
        TchProf
      </div>

 
         
     
    </>
  );
}
