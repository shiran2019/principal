import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./Appointments.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import NavigationBar from "../../../components/Navbar";
import { AuthContext } from "../../../helpers/AuthContext";
import ConfirmationPopup from "../../../components/ConfirmationPopup"; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let aptArray = [];

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
  const [selectedRequestId, setSelectedRequestId] = useState("");

  const [formattedDateTime, setFormattedDateTime] = useState("");
  const [formattedDateTimePlusOneHour, setFormattedDateTimePlusOneHour] = useState("");
  
  const handleRejectConfirmation = (requestId) => {
    setSelectedRequestId(requestId);
    setShowConfirmation(true);
  };

  const ReqUpdt = (dat, tim) => {
    const date = new Date(dat);
    const time = tim;
    const [hours, minutes] = time.split(':');
    date.setHours(hours);
    date.setMinutes(minutes);
    
    const formattedDateTime = date.toISOString().slice(0, 19);
    
    // Create a new Date object for the current date and time
    const currentDate = new Date();
    
    // Set the hours and minutes from the input date and time
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    
    // Add one hour to the current date
    const oneHourLater = new Date(currentDate.getTime() + 0.5* 60 * 60 * 1000);
    
    const formattedDateTimePlusOneHour = oneHourLater.toISOString().slice(0, 19);
    
    // Add 5.5 hours to formattedDateTime
    const hoursToAdd = 5.5;
    const six = 7;

    const fiveAndHalfHoursLater = new Date(date.getTime() + hoursToAdd * 60 * 60 * 1000);
    const formattedDateTimePlusFiveAndHalfHours = fiveAndHalfHoursLater.toISOString().slice(0, 19);

    const sixAndHalfHoursLater = new Date(date.getTime() + six * 60 * 60 * 1000);
    const formattedDateTimePlusSixAndHalfHours = sixAndHalfHoursLater.toISOString().slice(0, 19);
  
 
    localStorage.setItem("time", formattedDateTimePlusFiveAndHalfHours);
    localStorage.setItem("time2", formattedDateTimePlusSixAndHalfHours);
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
    ShowRequests();
    
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


  const ShowRequests = async() => {
   
   await axios
    .get(`http://localhost:3001/appointmentRequest/tch/${localStorage.getItem("user")}`)
    .then((response) => {
      
      setReqArray(response.data);
      console.log(response.data);
  
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  };

  

const UpdateRequests = (id , date , time , note,std,name) => {
  localStorage.setItem("isOverlaped", false);
  const newTime = new Date(date+"T"+time+":00");

  aptArray = [];
  console.log(newTime)
  
  console.log(events)
  events.forEach((item) => {
    if (new Date(item.start.value) <= newTime && new Date(item.end.value).setHours(new Date(item.end.value).getHours() + 2) >= newTime ) {
      localStorage.setItem("isOverlaped", true);
      //console lo overlapped appointments
      console.log(item);
      console.log(localStorage.getItem("isOverlaped"));
    } 
  });

  if (localStorage.getItem("isOverlaped")=== "true") {
    alert("You have another appointment at this time");
  }else{

    console.log(aptArray);


    const data = {
      Status: "Approved",
    };
        axios
        .post(`http://localhost:3001/appointmentRequest/${id}/updateStatus`, data)
        .then((response) => {
          ReqUpdt(date , time);
          onSubmitt(note,std,name);
          ShowRequests();
          UpdCalender();

        })
        .catch((error) => {
          
            toast.warn("Network error: Data not updated")
        });

       
  }
 
  };


  const DeleteRequests = async (x) => {
    try {
      await axios.delete(`http://localhost:3001/appointmentRequest/delete/${x}`);
     
    } catch (error) {
      console.error("An error occurred:", error);
    }
    ShowRequests();
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

  const onSubmitt = async (note,std,name) => {

    const updateDETA = {
      start: localStorage.getItem("time"),
      end: localStorage.getItem("time2"),
      id: DayPilot.guid(),
      text: "Meeting with " + std + " - " + name + "'s parent",
      backColor: "#e8762a",
      teacherId: authState.user,
    };

    try {
      const response = await axios.post("http://localhost:3001/appointments/Appointments", updateDETA);
      
      
      UpdCalender(authState.user);
      ShowRequests();
      
    } catch (error) {
      console.error("An error occurred:", error);
    }
   ShowRequests();
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

  const Run = () => {
    aptArray = [];
    console.log(events)
    events.map((item) => (
      aptArray.push(item.start.value)
     ));
    console.log(aptArray);

  }
  return (
    <>
<div style={{padding:"0% 2%"}}>
<a href="#sec1">
<button style={buttonStylex}>
Appointment requests
</button></a>
<a href="#sec2">
<button style={buttonStylex}>
My appointment sheadule
</button></a>
</div>
<hr></hr>

     <AuthContext.Provider value={{ authState, setAuthState }}>
     <div id="sec1" style={{padding:"2% 2%"}}>
      <h3  style={{ marginBottom:"3%" }}>Requests</h3>
      <center>
    <Table style={{  marginBottom:"3%" }} >
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
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
                    <td>{requests.fName}</td>
                    <td>{requests.Day}</td>
                    <td>{requests.time}</td>
                    <td>{requests.Note}</td>

                    <td>
                    <Button
                    variant="primary"
                    style={{backgroundColor: "green" , marginRight: "10px", textAlign: "center"}}
                    onClick={() => UpdateRequests(requests.id, requests.Day, requests.time, requests.Note, requests.StudentId, requests.fName)}
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
      <h3 id="sec2" style={{ marginLeft:"2%" }}>My appointment sheadule</h3>
    <div style={{padding:"2% 2%"}}>
     
      <center>
      </center>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "10px" }}>
          <div>
            <button style={buttonStylex} onClick={()=>{Run()}}></button>
         
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
        <ToastContainer style={{marginTop:"7%"}}  position="top-center" autoClose={3000} />
    
</>
  );
};

export default TeacherApp;
