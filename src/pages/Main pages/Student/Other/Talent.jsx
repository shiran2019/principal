import React, { useState, useEffect } from "react";
import NavigationBar from '../../../../components/Navbar'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pr from '../../../../images/pr.jpg'
import tr from '../../../../images/tr.png'
import axios from "axios";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../..//Firebase";

export const Talent = () => {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/bestKid")
      .then((response) => {
        setFilteredTableArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const retrieveImage = (id) => {
    if (id && !imageUrls[id]) {
      const storageRef = ref(storage, `images/${id}`);
      listAll(storageRef)
        .then((res) => {
          const urls = res.items.map((itemRef) => getDownloadURL(itemRef));
          Promise.all(urls)
            .then((urls) => {
              setImageUrls((prevUrls) => ({
                ...prevUrls,
                [id]: urls,
              }));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No image ID found.");
    }
  };

  return (
    <>
      <div>
        <NavigationBar />
      </div>

      <div>
        <Row style={{ padding: "10px 50px" }}>
          {filteredTableArray.map((Item, idx) => {
            const cardImageId = Item.StudentId;
            if (!imageUrls[cardImageId]) {
              retrieveImage(cardImageId);
            }
            return (
              <div key={idx}>
                <Row>
                <Col xs={12} md={6} lg={3}>
                  <Card>
                    {imageUrls[cardImageId] ? (
                      <Card.Img
                        variant="top"
                        src={imageUrls[cardImageId][0]}
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </Card>
                </Col>

                <Col xs={12} md={6} lg={4}>
                  <div style={{ textAlign: "center" }}>
                    <h1>{Item.stdName}</h1>
                    <h2>{Item.eventName}</h2>
                    <p style={{ fontSize: "18px" }}>Class: {Item.className}</p>
                  </div>
                </Col>

                <Col xs={12} md={6} lg={2}>
                  <Card.Img variant="top" src={tr} />
                </Col>

                <hr style={{ marginTop: "15px" }} />
                </Row>
              </div>
             
            );
          })}
        </Row>
      </div>
    </>
  );
};
