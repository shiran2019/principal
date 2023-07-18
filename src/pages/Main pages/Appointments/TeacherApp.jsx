import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./Appointments.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import NavigationBar from "../../../components/Navbar";
import { AuthContext } from "../../../helpers/AuthContext";
import ConfirmationPopup from "./ConfirmationPopup"; 



const TeacherApp = () => {



    const [authState, setAuthState] = useState({
        user: "",
        status: false,
        id: 0,
        role: "",
      });
    
      useEffect(() => {
        axios
          .get("http://localhost:3001/users/auth", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            console.log(response.data.role);
            if (response.data.error) {
              setAuthState({ ...authState, status: false });
            } else if(response.data.role == "Student"){
              setAuthState({
                user: response.data.user,
                status: true,
                id: 1,
                role: response.data.role,
              })
            }
            else if(response.data.role == "Admin"){
              setAuthState({
                user: response.data.user,
                status: true,
                id: 2,
                role: response.data.role,
              })
            }else if(response.data.role == "Teacher"){
              setAuthState({
                user: response.data.user,
                status: true,
                id: 3,
                role: response.data.role,
              })
            }
            else console.log("fsgfgfg")
          });

         
      }, []);
    
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

  const [viewEvent, setViewEvent] = useState([]);
  const [updatedEvents, setUpdatedEvents] = useState([]);
  const [selectedItem2, setSelectedItem2] = useState("");
  const [events, setEvents] = useState([]);

  const [teacherArray, setTeacherArray] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [deleted, setDeleted] = useState("");

  const [reqArray, setReqArray] = useState([]);

  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing/hiding the confirmation popup
  const [selectedRequestId, setSelectedRequestId] = useState(""); // State for tracking the selected request ID

  const handleRejectConfirmation = (requestId) => {
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
 

useEffect(() => {   
    localStorage.setItem("user", authState.user);
    UpdCalender();
      ShowRequests();
}, [authState.user]);




  const UpdCalender = () => {
    
    
    axios
      .get(`http://localhost:3001/appointments/Appointments/${localStorage.getItem("user")}`)
      .then((response) => {
        console.log(response.data);
        const newEvents = response.data.map((item) => ({
          start: item.start,
          end: item.end,
          id: item.id,
          text: item.text,
          backColor: item.backColor,
        }));
        setEvents(newEvents);
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
      ShowRequests();
    })
    .catch((error) => {
        alert("Network error: Data not updated");
    });
  };


  const DeleteRequests = async (x) => {
    try {
      await axios.delete(`http://localhost:3001/appointmentRequest/delete/${x}`);
      alert("Deleted successfully");
      ShowRequests();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };


  useEffect(() => {
    deleteEvent(localStorage.getItem("deleted"));
  }, [deleted]);



  useEffect(() => {
    
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
        
        UpdCalender(authState.user);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }, [updatedEvents, events]);


  const onSubmit = async (data) => {

    const updateDETA = {
      start: data.start.value,
      end: data.end.value,
      id: data.id,
      text: data.text,
      backColor: data.backColor,
      teacherId: authState.user,
    };

    try {
      const response = await axios.post("http://localhost:3001/appointments/Appointments", updateDETA);
      
      UpdCalender(authState.user);
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
        color: "#3d85c6",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Green",
        icon: "icon icon-green",
        color: "#6aa84f",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Yellow",
        icon: "icon icon-yellow",
        color: "#ecb823",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Red",
        icon: "icon icon-red",
        color: "#d5663e",
        onClick: (args) => updateColor(args.source, args.item.color),
      },
      {
        text: "Purple",
        icon: "icon icon-purple",
        color: null,
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
     <AuthContext.Provider value={{ authState, setAuthState }}>
     <div style={{padding:"2% 2%"}}>
      <h3 style={{ color: "#5b5ea6", marginBottom:"3%" }}>Requests</h3>
      <center>
    <Table style={{  marginBottom:"3%" }} >
              <thead>
                <tr>
                  <th>Student ID</th>
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
                      onClick={() => handleRejectConfirmation(requests.id)} // Call handleRejectConfirmation instead of DeleteRequests
                    >
                      Reject
                    </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </center>
    </div>
      <div className="App">
        <NavigationBar />
      </div>
    <div style={{padding:"2% 2%"}}>
     
      <center>
      </center>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <div>
           
          </div>
          <DayPilotNavigator {...navigatorConfig} />
        </div>
        <div style={{ flexGrow: "1" }}>
          <DayPilotCalendar {...calendarConfig} ref={calendarRef} events={events} />
        </div>
      </div>
    </div>

 
    </AuthContext.Provider>

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

export default TeacherApp;
