import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pr from '../../../images/pr.jpg'
import { FormControl, Modal, Button } from "react-bootstrap";

// Popup Component
const PopupComponent = ({ show, handleClose, cardId }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Student ID: {cardId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Popup content goes here.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function Artgal() {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [array, setArray] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isShow, setIsShow] = useState(false);

  const handleClosePopup = () => {
    setSelectedCard(null);
    setIsShow(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/students")
      .then((response) => {
        setArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  useEffect(() => {
    handleSearch1();
  }, [array, searchTerm1]);

  useEffect(() => {
    handleSearch2();
  }, [searchTerm2, array]);

  const handleSearch2 = () => {
    if (searchTerm2 === "") {
      setFilteredTableArray(array);
      return;
    }
    const filteredData = filteredTableArray.filter((item) =>
      item.fName.toLowerCase().includes(searchTerm2.toLowerCase())
    );
    setFilteredTableArray(filteredData);
  };

  const handleSearch1 = () => {
    if (searchTerm1 === "") {
      setFilteredTableArray(array);
      return;
    }
    const filteredData = array.filter((item) =>
      item.className.toLowerCase().includes(searchTerm1.toLowerCase())
    );
    setFilteredTableArray(filteredData);
  };

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

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
    setIsShow(true);
  };

  return (
    <>
      <div className="App">
        <NavigationBar />
      </div>

      <div>
        <Row style={{ padding: "1% 5%" }}>
          <Col xs={12} lg={4}>
            <label style={labelStyle}>Search Class Room:</label>
            <FormControl
              type="text"
              placeholder="Search by Class Room"
              value={searchTerm1}
              style={inputStyle}
              onChange={(e) => setSearchTerm1(e.target.value)}
            />
          </Col>
          <Col xs={12} lg={4}>
            <label style={labelStyle}>Search ID here:</label>
            <input
              type="text"
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
              style={inputStyle}
              placeholder="Search by first name"
            />
          </Col>
        </Row>

        <Row style={{ padding: "1% 5%" }}>
          {filteredTableArray.map((Item) => (
            <Col key={Item.StudentId} xs={12} md={6} lg={3} style={{ padding: "1% 1%" }}>
              <Card onClick={() => handleCardClick(Item.StudentId)}>
                <Card.Img variant="top" src={pr} />
                <Card.Body>
                  <Card.Title>{Item.StudentId} : {Item.fName}</Card.Title>
                  <Card.Text>
                    {Item.pNote}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          <Button variant="success" onClick={() => setIsShow(true)}>
            Open Modal
          </Button>
          <PopupComponent show={isShow} handleClose={handleClosePopup} cardId={selectedCard} />
        </Row>
      </div>
    </>
  );
}
