import axios from "axios";
import React, { useState, useEffect } from "react";

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FormControl, Modal, Button } from "react-bootstrap";
import { getDownloadURL, listAll, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "../../../..//Firebase";
import NavigationBar from "../../../../components/Navbar";


export const MyArts = () => {

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [array, setArray] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  const retrieveImages = async () => {
    if (localStorage.getItem('user')) {
      const storageRef = ref(storage, `images/${localStorage.getItem('user')}/${localStorage.getItem('user')}`);
      try {
        const res = await listAll(storageRef);
        const urls = [];
        for (const itemRef of res.items) {
          try {
            const url = await getDownloadURL(itemRef);
            urls.push(url);
          } catch (error) {
            console.log(error);
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('No image ID found.');
    }
  };

 useEffect(() => {  
    retrieveImages();
  }, []);


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


  return (
    <>
    <div>
      <NavigationBar />
    </div>
      

       <Row style={{paddingLeft:"4%", paddingRight:"4%"}}>
        
       <h2>My Arts and Crafts,</h2>
              
                {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
             
                 <Col key={index}  xs={12} md={6} lg={6} style={{ padding: "1% 1%" }}>
                <img src={url} style={{ width: '100%' }} alt="Uploaded" />
                </Col>
            
            ))
          ) : (
            <div>Loading...</div>
          )}
         
      
        
            
         
     

            </Row>
    </>
  );
}
