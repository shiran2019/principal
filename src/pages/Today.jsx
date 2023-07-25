import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./Today.css";
import NavigationBar from "../..//src/components/Navbar";


const Today = () => {

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
    deleteEvent(localStorage.getItem("deleted"));
  }, [deleted]);

  useEffect(() => {
    UpdCalender();
   
  }, []);



  useEffect(() => {
    console.log("updatedEvents", updatedEvents);
    updatedEvents.forEach(async (item) => {
      const data = {
        start: item.start,
        end: item.end,
        id: item.id,
        text: item.text,
        backColor: item.backColor,
      };

      try {
        const response = await axios.post("http://localhost:3001/today/Today", data);
        UpdCalender();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }, [updatedEvents, events]);

  const onSubmit = async (data) => {
    console.log("data", data);

    const updateDETA = {
      start: data.start.value,
      end: data.end.value,
      id: data.id,
      text: data.text,
      backColor: data.backColor,
      
    };

    try {
      const response = await axios.post("http://localhost:3001/today/Today", updateDETA);
      
      UpdCalender();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const deleteEvent = async (event) => {
    try {
      await axios.delete(`http://localhost:3001/today/Today/${localStorage.getItem("deleted")}`);
      setDeleted("");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const onBeforeEventRender = (args) => {
    if (args.div) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.className = "event-delete-button";
      deleteButton.addEventListener("click", () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
          const eventToDelete = events.find((e) => e.id === args.e.id());
          if (eventToDelete) {
            deleteEvent(eventToDelete);
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

  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: (args) => {
          const e = args.source;
          calendarRef.current.control.events.remove(e);
          localStorage.setItem("deleted", e.cache.id);
          setDeleted(e.cache.id);
        },
      },
      {
        text: "-",
      },
      {
        text: "Blue",
        icon: "icon icon-blue",
        color: "#85C1E9",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Green",
        icon: "icon icon-green",
        color: "#76D7C4",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Yellow",
        icon: "icon icon-yellow",
        color: "#F7DC6F",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Red",
        icon: "icon icon-red",
        color: "#F1948A",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Purple",
        icon: "icon icon-purple",
        color: "#C39BD3",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
    ],
  });

  const updateColor = (e, color) => {
    e.data.backColor = color;
    calendarRef.current.control.events.update(e);
    console.log(e.data);
    onSubmit(e.data);
  };

  const calendarConfig = {
    
    durationBarVisible: false,
   
    onTimeRangeSelected: async (args) => {
      const dp = calendarRef.current.control;
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");

      dp.clearSelection();
      if (!modal.result) {
        return;
      }

      const newEvent = {
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result,
        backColor: "#3d85c6",
      };
      setEvents([...events, newEvent]);
      onSubmit(newEvent);
    },
    onEventClick: async (args) => {
      const dp = calendarRef.current.control;
      const modal = await DayPilot.Modal.prompt("Edit event text:", args.e.text());

      if (!modal.result) {
        return;
      }

      const updatedEvent = {
        start: args.e.start(),
        end: args.e.end(),
        id: args.e.id(),
        text: modal.result,
        backColor: args.e.data.backColor,
      };
      setEvents((prevEvents) => {
        const index = prevEvents.findIndex((e) => e.id === args.e.id());
        const newEvents = [...prevEvents];
        newEvents[index] = updatedEvent;
        return newEvents;
      });
      dp.events.update(args.e, updatedEvent);
      onSubmit(updatedEvent);
      console.log("updatedEvent", updatedEvent);
    },
    onBeforeEventRender,
    contextMenu,
  };

  const navigatorConfig = {
    selectMode: "day",
  
    onTimeRangeSelected: (args) => {
      const dp = calendarRef.current.control;
      dp.startDate = args.start;
      dp.update();
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
export default Today;


