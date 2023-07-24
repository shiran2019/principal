import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./Today.css";
import NavigationBar from "../../../../components/Navbar";



const STDToday = () => {

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "20px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
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

  const calendarRef = useRef();

  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing/hiding the confirmation popup
  const [selectedRequestId, setSelectedRequestId] = useState(""); // State for tracking the selected request ID


  const [viewEvent, setViewEvent] = useState([]);
  const [updatedEvents, setUpdatedEvents] = useState([]);
  const [selectedItem2, setSelectedItem2] = useState("");
  const [events, setEvents] = useState([]);

  const [teacherArray, setTeacherArray] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [deleted, setDeleted] = useState("");

  const [reqArray, setReqArray] = useState([]);
 
  const handleRejectConfirmation = (requestId) => {
    alert(requestId);
    
    setSelectedRequestId(requestId);
    setShowConfirmation(true);
  };

  const handleRejectConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  const handleRejectConfirmationConfirm = () => {
    setShowConfirmation(false);
  };

  const StoreTeacher = (selectedItem) => {
    if (selectedItem) {
      localStorage.setItem("TeacherId", selectedItem);
    }
  };



  const UpdCalender = (x) => {
    axios
      .get(`http://localhost:3001/today`)
      .then((response) => {
        const newEvents = response.data.map((item) => ({
          start: item.start,
          end: item.end,
          id: item.id,
          text: item.text,
          backColor: item.backColor,
        }));
        setEvents(newEvents);
        StoreTeacher(selectedItem);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };


  





  useEffect(() => {
    UpdCalender();
   
  }, []);



  const onBeforeEventRender = (args) => {
    if (args.div) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.className = "event-delete-button";
      deleteButton.addEventListener("click", () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
          const eventToDelete = events.find((e) => e.id === args.e.id());
          if (eventToDelete) {
            
          }
        }
      });

      const eventElement = args.div.querySelector(".calendar_default_event_inner");
      if (eventElement) {
        eventElement.appendChild(deleteButton);
        eventElement.style.position = "relative";
      }
    }
  };

  

  const calendarConfig = {
    
    durationBarVisible: false,
   
    onTimeRangeSelected: async (args) => {
      
  
    },
    
    
  };

  const navigatorConfig = {
    selectMode: "day",
  
    onTimeRangeSelected: (args) => {
     
    },
  };

  const [menu, setMenu] = useState(false);

  const handleClick = () => {
    setMenu(!menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
<div className="App">
        <NavigationBar />
      </div>
  <center>    <h2>TODAY TIMETABLE</h2></center>
    <div style={{padding:"0px 5%"}}>
     
      <center>
      </center>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
        
          <DayPilotNavigator {...navigatorConfig} />
        </div>
        <div style={{ flexGrow: "1" }}>
          <DayPilotCalendar {...calendarConfig} ref={calendarRef} events={events} />
        </div>
      
      </div>
    </div>

    
</>
  );
};
export default STDToday;


