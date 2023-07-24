import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";
import Card from "react-bootstrap/Card";
import { FormControl, Modal, Button } from "react-bootstrap";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../Firebase";

import Box from "@mui/material/Box";
import { DataGrid, GridCellModes }from "@mui/x-data-grid";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";





// Popup Component
const PopupComponent = ({
  show,
  cardId,
  handleClosePopup,
  fName,
  className,
  Reload
}) => {

    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageId, setImageId] = useState('');
    const [imageUrls, setImageUrls] = useState([]);

    const [day, setDay] = useState("");
    const [eventName, setEventName] = useState("");

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
  const onSubmit = (data, resetForm ) => {

    console.log(data);

    const data1 = {
        StudentId: cardId,
        stdName: fName,
        className: className,
        Day: day,
        eventName: eventName,
    };
    console.log(data1);

    axios
      .post("http://localhost:3001/bestKid", data1)
      .then((response) => {
        
        alert("Added new class successfully");
        handleClosePopup();
        Reload();
        
        
      })
      .catch((error) => {
        console.log(error);
        
      })
    };



  const initialValues = {
    stdName: "",
    className: "",
    StudetId: "",
    Day: "",
    eventName: "",
  };

  const handleClose = () => {
    handleClosePopup();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Student ID: {cardId}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%", maxHeight: "100%" }}>
        <div>
          <Formik initialValues={initialValues}>
            <Form onSubmit={onSubmit}>
              <Row>
                <Col xs={12} lg={6}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Student Id :
                  </label>
                  <Field
                    type="text"
                    name="StudentId"
                    placeholder="Enter Student Name"
                    className="form-control"
                    value={cardId}
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
                    name="StudentId"
                    component="span"
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
                    Student Name :
                  </label>
                  <Field
                    type="text"
                    name="stdName"
                    className="form-control"
                    value={fName}
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
                    name="stdName"
                    component="span"
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
                    Class Name :
                  </label>
                  <Field
                   
                    type="text"
                    name="className"
                    className="form-control"
                    value={className}
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
                    name="className"
                    component="span"
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
                  <input
                    type="date"
                    name="Day"
                    onChange={(e) => setDay(e.target.value)}
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
                <Col xs={12} lg={6}>
                  <label
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Talent :
                  </label>
                  <input
                   id="inputCreatePost"
                    as = "textarea"
                    name="eventName"
                    className="form-control"
                  onChange={(e) => setEventName(e.target.value)}
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
                    name="eventName"
                    component="span"
                    style={{ color: "red" }}
                  />
                </Col>
              </Row>
            </Form>
          </Formik>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button style={buttonStyle} onClick={handleClose}>
          Close
        </Button>
        <Button style={buttonStyle} onClick={onSubmit} >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const BestKid = () => {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [array, setArray] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardname, setSelectedCardname] = useState(null);
  const [selectedCardclass, setSelectedCardclass] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  const [filteredArray, setFilteredArray] = useState([]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'stdName',
      headerName: 'Student Name',
      width: 150,
      editable: false,
    },
    {
      field: 'className',
      headerName: 'Class name',
      width: 150,
      editable: true,
    },
    {
      field: 'eventName',
      headerName: 'Event Name',
      width: 150,
      editable: true,
    },
    {
      field: 'Day',
      headerName: 'Date',
      width: 200,
      editable: true,
      
    
    },
    {
      field: 'Delete',
      width: 150,
      renderCell: (row) => (
        <button onClick={()=>DeleteCard(row.id)}>delete</button>
      )
    },
   
  ];


  const retrieveImage = (id) => {
    if (id) {
      const storageRef = ref(storage, `images/${id}`);
      listAll(storageRef)
        .then((res) => {
          const urls = [];
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef)
              .then((url) => {
                urls.push(url);
              })
              .catch((error) => console.log(error));
          });
          setImageUrls((prevUrls) => ({
            ...prevUrls,
            [id]: urls,
          }));
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No image ID found.");
    }
  };

  const handleClosePopup = () => {
    setSelectedCard(null);
    setIsShow(false);
  };

  const Reload = () => {
    axios
    .get("http://localhost:3001/students")
    .then((response) => {
      setArray(response.data);
      return  axios.get("http://localhost:3001/bestKid")
    })
    .then((response) => {
      setFilteredArray(response.data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  };

  useEffect(() => {
    Reload();
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

  const handleCardClick = (cardId, fName, className) => {
    setSelectedCard(cardId);
    setSelectedCardname(fName);
    setSelectedCardclass(className);
    setIsShow(true);
  };


  const DeleteCard = (x) => {
    axios
      .delete(`http://localhost:3001/bestKid/ann/${x}`)
      .then((response) => {
        alert("Deleted successfully");
        Reload();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
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
            <label style={labelStyle}>Search Student name here:</label>
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
          {filteredTableArray.map((Item) => {
            const cardImageId = Item.StudentId;
            if (!imageUrls[cardImageId]) {
              retrieveImage(cardImageId);
            }
            return (
              <Col
                key={Item.StudentId}
                xs={12}
                md={6}
                lg={2}
                style={{ padding: "1% 1%" }}
              >
                <Card
                  onClick={() =>
                    handleCardClick(Item.StudentId, Item.fName, Item.className)
                  }
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {imageUrls[cardImageId] ? (
                      <Card.Img
                        variant="top"
                        src={imageUrls[cardImageId][0]}
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title>
                      {Item.StudentId} : {Item.fName}
                    </Card.Title>
                    <Card.Text>{Item.pNote}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Row>
          <Button variant="success" onClick={() => setIsShow(true)}></Button>
          <PopupComponent
            show={isShow}
            handleClosePopup={handleClosePopup}
            cardId={selectedCard}
            fName={selectedCardname}
            storage={storage}
            className={selectedCardclass}
            Reload={Reload}

          />
        </Row>
      </div>
      <div>

      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={filteredArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
       
      />
    </Box>
      </div>
    </>
  );
};
