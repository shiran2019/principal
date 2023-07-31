import axios from "axios";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import './AnnualReport.css'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../..//Firebase";




import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';



export const Annualreport = () => {
  
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [array, setArray] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [regYear, setRegYear] = useState("");

  const [imageUrl, setImageUrl] = useState();

  const retrieveImage = () => {
    const storageRef = ref(storage, `report/${regYear}`);
    listAll(storageRef)
      .then((res) => {
        if (res.items.length > 0) {
          // Assuming there is only one PDF file, use the first itemRef
          const itemRef = res.items[0];
          getDownloadURL(itemRef)
            .then((url) => {
              setImageUrl(url);
            })
            .catch((error) => {
              console.log("Error getting download URL:", error);
              setImageUrl(null); // Set imageUrl to null on error
            });
        } else {
          setImageUrl(null); // Set imageUrl to null if no PDF found
        }
      })
      .catch((error) => {
        console.log("Error listing files:", error);
        setImageUrl(null); // Set imageUrl to null on error
      });
  };

  useEffect(() => {
    retrieveImage();
  }, [regYear]);

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "50px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
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

  const newPlug = defaultLayoutPlugin();

  return (
    <>
   
      

       <Row style={{paddingLeft:"4%", paddingRight:"4%"}}>
        
       <h2>Download Annual Plan,</h2>
              
            
             
       <Col xs={12} lg={8} >
        <Formik>
          <Form>
              <label style={labelStyle}>Year:</label>
              <Field
                as="select"
                id="inputCreatePost"
               
                style={inputStyle}
                onChange={(e) => setRegYear(e.target.value)}
                
              >
                <option value="">Select Year</option>
                {renderYearOptions()}
              </Field>
              </Form>
              </Formik>
            </Col>
            <Col xs={12} md={6} lg={12} style={{ padding: "1% 1%" }}>
      {imageUrl ? (
        <div>
          <a href={imageUrl} download>
            Download File
          </a>
          
        </div>
      ) : (
        <div>Annual Plan Not uploaded for the selected year</div>
      )}
    </Col>
            

            </Row>
    </>
  );
}
