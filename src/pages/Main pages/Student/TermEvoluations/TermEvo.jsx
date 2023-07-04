import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";


export default function TermEvo() {
  const [lists, setLists] = useState([]);
  const [array, setArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTableArray, setFilteredTableArray] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/createEvoluations")
      .then((response) => {
        setArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "20px",
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

  const handleRowClick = (rowId) => {
    setSelectedRowId(rowId);
    const selectedRow = filteredTableArray.find((item) => item.id === rowId);
    console.log(selectedRow);

    if (selectedRow) {
      const createEvoId = selectedRow.id;
      axios
        .get(`http://localhost:3001/termEvoluations/${createEvoId}`)
        .then((response) => {
          setLists(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  useEffect(() => {
    const filteredData = array.filter((item) =>
      item.EvoType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTableArray(filteredData);
  }, [searchTerm, array]);

  return (
    <>
       
    <div style={{width:"100%"}}>
      <Row>
        <Col xs={12} lg={6}>
          <label style={labelStyle}>Search term evaluation here:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            placeholder="Search by EvoType"
            
          />
        </Col>
        </Row>
        <Row>
        <Col xs={12} lg={6}>
          <label style={labelStyle}>Term Evaluations</label>
          <Table  bordered hover>
            <thead>
              <tr>
                <th>Evoluation Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableArray.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={selectedRowId === item.id ? "selected" : ""}
                >
                  <td>{item.EvoType}</td>
                  <td>{item.Day}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col xs={12} lg={6}>
        <label style={labelStyle}>Student Marks</label>
          {lists.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {lists.map((item) => (
                  <tr key={item.id}>
                    <td>{item.StudentId}</td>
                    <td>{item.Mark}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
       
      </Row>
      
      </div>
    </>
  );
}
