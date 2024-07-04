import { Formik, Form, Field, ErrorMessage } from "formik";

import React, { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../../../../components/Navbar";
import ConfirmationPopup from "../../../../components/ConfirmationPopup";

import { AuthContext } from "../../../../helpers/AuthContext";

export const TchAnn = () => {
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const [classArray, setClassArray] = useState([]);
  const [reqArray, setReqArray] = useState([]);
  const [idd, SetIdd] = useState(
    new Date().toLocaleDateString("en-US").substr(0, 10)
  );

  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");

  const [regYear, setRegYear] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const { authState } = useContext(AuthContext);
  const [reqTchArray, setReqTchArray] = useState([]);

  const handleRejectConfirmation = (requestId) => {
    setSelectedRequestId(requestId);
    setShowConfirmation(true);
  };

  const handleRejectConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  const handleRejectConfirmationConfirm = () => {
    DeleteCard(selectedRequestId);
    setShowConfirmation(false);
  };

  const onSubmit = (data, { resetForm }) => {
    const data1 = {
      ...data,
      state: "active",
      Day: idd,
    };
    console.log(data1);
    axios
      .post("http://localhost:3001/announcements", data1)
      .then((response) => {
        resetForm();
        ShowRequests();
        ShowRequestClass();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    ShowRequests();
    ShowRequestClass();
    ShowClass();
  }, []);

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

  const ShowClass = () => {
    axios
      .get(`http://localhost:3001/classes/cls`)
      .then((response) => {
        setClassArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const DeleteCard = (x) => {
    axios
      .delete(`http://localhost:3001/announcements/ann/${x}`)
      .then((response) => {
        ShowRequests();
        ShowRequestClass();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const ShowRequestClass = () => {
    axios
      .get(`http://localhost:3001/announcements/tchCls`)
      .then((response) => {
        setReqTchArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const initialValues = {
    role: "",
    Day: "",
    state: "",
    Note: "",
  };

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const noteStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "italic",
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

  const buttonStyles = {
    marginTop: "10px",
    padding: "6px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
  };

  const buttonStyle2 = {
    padding: "8px 20px",
    backgroundColor: "#fa4362",
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
    maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  const validate3 = (value) => {
    let error;
    if (!value) {
      error = "Fill the field";
    }
    return error;
  };

  const validateclass = (value) => {
    let error;
    if (!value) {
      error = "Class room is required";
    }
    return error;
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
  const buttonStylex = {
    padding: "10px 40px",
    backgroundColor: "#f59e42",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
    marginLeft: "10px",
  };
  return (
    <>
      <div>
        <NavigationBar />
      </div>
      <div style={{ marginLeft: "5%" }}>
        <a href="#sec1">
          <button style={buttonStylex}>Today Admin Announcements</button>
        </a>
        <a href="#sec2">
          <button style={buttonStylex}>Add Student Announcement</button>
        </a>
        <a href="#sec3">
          <button style={buttonStylex}>Student Announcements</button>
        </a>
      </div>
      <hr></hr>
      <div style={{ backgroundColor: "#cccccc" }} id="sec1">
        <h2 style={{ padding: "25px  5%", marginBottom: "20px" }}>
          Today Admin Announcements{" "}
        </h2>
        <Row style={{ padding: "0px  10%" }}>
          {reqArray.map((requests) => (
            <Col xs={12} md={6} lg={3} style={{ marginBottom: "15px" }}>
              <Card style={{ backgroundColor: "#cbf5cb" }}>
                <Card.Body>
                  <Card.Title>PRINCIPAL</Card.Title>
                  <hr></hr>
                  <Card.Text>Announcement : {requests.Note}</Card.Text>
                  <Card.Text>{requests.Day}</Card.Text>
                  <button
                    style={buttonStyle2}
                    onClick={() => handleRejectConfirmation(requests.id)}
                  >
                    Delete
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div id="sec2" style={{ paddingRight: "5%" }}>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <Form>
            <hr></hr>
            <Row>
              <Col lg={7}>
                <Row style={{ padding: "25px  10%" }}>
                  <h2 style={{ marginBottom: "30px" }}>
                    Add Student Announcement{" "}
                  </h2>

                  <Col xs={12} lg={6}>
                    <label style={labelStyle}>Class room:</label>
                    <Field
                      as="select"
                      id="inputCreatePost"
                      name="role"
                      style={inputStyle}
                      validate={validateclass}
                    >
                      <option value="">Select item</option>

                      {classArray.map((classItem) => (
                        <option
                          key={classItem.className}
                          value={classItem.className}
                        >
                          {classItem.className}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
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
                    <Field
                      editable={false}
                      name="Day"
                      className="form-control"
                      value={idd}
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

                  <Col xs={12} lg={12}>
                    <label
                      style={{
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Announcement:
                    </label>
                    <Field
                      as="textarea"
                      name="Note"
                      className="form-control"
                      validate={validate3}
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
                      name="Note"
                      component="span"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>
                <Row style={{ padding: "0px  10%" }}>
                  <Col>
                    <button type="submit" style={buttonStyle}>
                      Submit
                    </button>
                  </Col>
                </Row>
                <Row style={{ padding: "0px  10%" }}>
                  <Col lg={12}>
                    <hr style={{ marginTop: "10px" }}></hr>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>

      <div id="sec3">
        <h3 style={{ padding: "25px  5%", marginBottom: "20px" }}>
          Sent Announcements
        </h3>
        <Row style={{ padding: "0px  10%" }}>
          {reqTchArray.map((requests) => (
            <Col xs={12} md={6} lg={3} style={{ marginBottom: "15px" }}>
              <Card style={{ backgroundColor: "#cbf5cb" }}>
                <Card.Body>
                  <Card.Text>
                    <h5> Announcement :</h5>
                  </Card.Text>
                  <Card.Text>{requests.Note}</Card.Text>
                  <Card.Text>{requests.Day}</Card.Text>

                  <button
                    style={buttonStyle2}
                    onClick={() => handleRejectConfirmation(requests.id)}
                  >
                    Delete
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to reject this Announcement?"
          onConfirm={handleRejectConfirmationConfirm}
          onCancel={handleRejectConfirmationCancel}
        />
      )}

      <ToastContainer
        style={{ marginTop: "7%" }}
        position="top-center"
        autoClose={3000}
      />
    </>
  );
};
