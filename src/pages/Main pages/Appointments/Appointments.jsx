import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./Appointments.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";

import NavigationBar from "../../../components/Navbar";
import ConfirmationPopup from "../../../components/ConfirmationPopup";



const Appointments = () => {
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

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(""); 


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
    DeleteRequests(selectedRequestId);
    setShowConfirmation(false);
  };

  const StoreTeacher = (selectedItem) => {
    if (selectedItem) {
      localStorage.setItem("TeacherId", selectedItem);
    }
  };

  const Teachers = () => {
    axios
      .get(`http://localhost:3001/teachers/tch`)
      .then((response) => {
        setTeacherArray(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const UpdCalender = (x) => {
    axios
      .get(`http://localhost:3001/appointments/Appointments/${x}`)
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

  const ShowRequests = () => {
    axios
    .get(`http://localhost:3001/appointmentRequest`)
    .then((response) => {
      setReqArray(response.data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  };

  

  
  const UpdateRequests = (x) => {
const data = {
  Status: "Approved",
};
    axios
    .post(`http://localhost:3001/appointmentRequest/${x}/updateStatus`, data)
    .then((response) => {
      alert("updated successfully");
      ShowRequests();
    })
    .catch((error) => {
        alert("Network error: Data not updated");
    });
  };


  const DeleteRequests = async (x) => {
    try {
      await axios.delete(`http://localhost:3001/appointmentRequest/delete/${x}`);
      ShowRequests();
      alert("Deleted successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    deleteEvent(localStorage.getItem("deleted"));
  }, [deleted]);

  useEffect(() => {
    Teachers();
    const x = localStorage.getItem("TeacherId");
    UpdCalender(x);
    ShowRequests();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      localStorage.setItem("Teachername", selectedItem2);
    }
  }, [selectedItem2]);

  useEffect(() => {
    UpdCalender(selectedItem);
    StoreTeacher(selectedItem);
  }, [selectedItem]);

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
        const response = await axios.post("http://localhost:3001/appointments/Appointments", data);
        const x = localStorage.getItem("TeacherId");
        UpdCalender(x);
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
      teacherId: localStorage.getItem("TeacherId"),
    };

    try {
      const response = await axios.post("http://localhost:3001/appointments/Appointments", updateDETA);
      const x = localStorage.getItem("TeacherId");
      UpdCalender(x);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const deleteEvent = async (event) => {
    try {
      await axios.delete(`http://localhost:3001/appointments/Appointments/${localStorage.getItem("deleted")}`);
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
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
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
    selectMode: "week",
    showMonths: 2,
    skipMonths: 1,
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
    <div>
     
      <center>
        <h2 >Teacher Name   : {localStorage.getItem("Teachername")},</h2>
      </center>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <div>
            <label style={labelStyle}>Select Teacher:</label>
            <select
              style={inputStyle}
              onChange={(e) => {
                setSelectedItem(e.target.value);
                const selectedTeacher = teacherArray.find((teacher) => teacher.teacherId === e.target.value);
                setSelectedItem2(selectedTeacher ? selectedTeacher.fName : "");
              }}
            >
              <option value="">Select</option>
              {teacherArray.map((teacher) => (
                <option value={teacher.teacherId} key={teacher.teacherId}>
                  {teacher.fName}
                </option>
              ))}
            </select>
          </div>
          <DayPilotNavigator {...navigatorConfig} />
        </div>
        <div style={{ flexGrow: "1" }}>
          <DayPilotCalendar {...calendarConfig} ref={calendarRef} events={events} />
        </div>
      </div>
    </div>
    <div>
      <h3 style={{  marginTop:"5%", marginBottom:"3%" }}>Requests</h3>
      <center>
    <Table  >
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Teacher ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Note</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reqArray.map((requests) => (
                  <tr key={requests.id}>
                    <td>{requests.StudentId}</td>
                    <td>{requests.teacherId}</td>
                    <td>{requests.Day}</td>
                    <td>{requests.time}</td>
                    <td>{requests.Note}</td>
                    <td>
                    <Button
                    variant="primary"
                    style={{backgroundColor: "green" , marginRight: "10px", textAlign: "center"}}
                    onClick={() => UpdateRequests(requests.id)}
                  >
                    Accept
                  </Button>
           <Button
                      variant="primary"
                      style={{ backgroundColor: "red", textAlign: "center" }}
                      onClick={() => handleRejectConfirmation(requests.id)}>
                      Reject
                    </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </center>

    </div>
    {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to reject this request?"
          onConfirm={handleRejectConfirmationConfirm}
          onCancel={handleRejectConfirmationCancel}
        />
      )}
</>
  );

};

export default Appointments;
