import axios from "axios";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../components/Navbar";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FormControl, Modal, Button } from "react-bootstrap";
import { getDownloadURL, listAll, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import CircularIndeterminate from "../../../components/Skelton";
import { storage } from "../../../Firebase";

// Popup Component
const PopupComponent = ({ show, cardId, handleClosePopup }) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const fileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      uploadFile(selectedFile);
    } else {
      console.log('No file selected.');
      alert('No file selected.');
    }
  };

  const uploadFile = (file) => {
    // Check the file type
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      alert('Only PNG and JPEG files are allowed.');
      return;
    }
  
    // Check the file size (in bytes)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      alert('File size exceeds the allowed limit (5 MB).');
      return;
    }
  
    const imageId = generateImageId(cardId);
    setImageId(imageId);
  
    const storageRef = ref(storage, `images/${imageId}/${imageId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        console.log(error);
        alert('Error occurred during image upload.');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setImageUrls((prevUrls) => [...prevUrls, url]);
            console.log(url);
            alert('Image uploaded successfully');
            setSelectedFile(null); // Clear the selected file
          })
          .catch((error) => {
            console.log(error);
            alert('Error occurred while fetching the image URL.');
          });
      }
    );
  };
  

  const retrieveImages = async () => {
    if (cardId) {
      const storageRef = ref(storage, `images/${cardId}/${cardId}`);
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

  const generateImageId = (cardId) => {
    return cardId; // Use the studentId as the imageId
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImageId('');
    setImageUrls([]);
    setProgress(0);
    handleClosePopup();
  };

  const deleteImage = async (imageUrl) => {
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      setImageUrls((prevUrls) => prevUrls.filter((url) => url !== imageUrl));
      console.log('Image deleted successfully');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveImages();
  }, [imageId, cardId]);

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
      <Modal.Body style={{ width: '100%', maxHeight: '100%' }}>
        <div>
          <h3>My Gallery,</h3>
          <form onSubmit={formSubmitHandler}>
            <input type="file" className="input" onChange={fileChangeHandler} />
            <button type="submit">Upload</button>
          </form>
          <hr />
          <h5>Uploaded {progress} %</h5>
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <div key={index}>
                <img src={url} style={{ maxWidth: '100%' }} alt="Uploaded" />
                <button onClick={() => deleteImage(url)}>Delete</button>
              </div>
            ))
          ) : (
            <div><CircularIndeterminate/></div>
          )}
          <button onClick={retrieveImages}>Retrieve Image</button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
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
  const [imageUrls, setImageUrls] = useState({});

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
              <Col key={Item.StudentId} xs={12} md={6} lg={3} style={{ padding: "1% 1%" }}>
              <Card onClick={() => handleCardClick(Item.StudentId)}>
                <div style={{ height: "200px", overflow: "hidden", cursor: "pointer" }}>
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
                  <Card.Title>{Item.StudentId} : {Item.fName}</Card.Title>
                  <Card.Text>
                    {Item.pNote}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            );
          })}
        </Row>

        <Row>
          <Button variant="success" onClick={() => setIsShow(true)}>
           
          </Button>
          <PopupComponent
            show={isShow}
            handleClosePopup={handleClosePopup}
            cardId={selectedCard}
            storage={storage}
          />
        </Row>
      </div>
    </>
  );
}
