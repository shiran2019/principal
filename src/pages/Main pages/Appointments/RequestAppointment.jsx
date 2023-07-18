import React, { useState, useRef, useEffect } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import "./Appointments.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import { AuthContext } from "../../../helpers/AuthContext";

const RequestAppointment = () => {
  const initialValues = {
    StudentId: "",
    teacherId: "",
    Note: "",
    Day: "",
    time: "",
  };

  const validateday = (value) => {
    let error;
    if (!value) {
      error = "Day is required";
    } else {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() - 1);

      if (selectedDate <= tomorrow) {
        error = "Day cannot be a past date";
      }
    }
    return error;
  };
  

  const validateNote = (value) => {
    let error;
    if (!value) {
      error = "Reason is required";
    } 
    return error;
  };

  const validatetime = (value) => {
    let error;
    if (!value) {
      error = "Time is required";
    } 
    return error;
  };
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

  const buttonStyle = {
    padding: "10px 40px",
    backgroundColor: "#007bff",
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

  const calendarRef = useRef();

  const [authState, setAuthState] = useState({
    user: "",
    status: false,
    id: 0,
    role: "",
  });

  const onSubmit = (data, { resetForm }) => {

  
 const data1 = {
...data,
      StudentId: authState.user,
      teacherId: localStorage.getItem("TeacherId"),
      Status: "Pending",
 }
    
    axios
      .post("http://localhost:3001/appointmentRequest", data1)
      .then((response) => {
        resetForm();
        
        alert("Added new class successfully");
      })
      .catch((error) => {
       
          alert("Network error: Data not submitted");
      
      });

    }
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
        } else if (response.data.role == "Student") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role == "Admin") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role == "Teacher") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else console.log("fsgfgfg");
      });
  }, []);

  const [viewEvent, setViewEvent] = useState([]);
  const [updatedEvents, setUpdatedEvents] = useState([]);
  const [selectedItem2, setSelectedItem2] = useState("");
  const [events, setEvents] = useState([]);

  const [teacherArray, setTeacherArray] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [deleted, setDeleted] = useState("");

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

  useEffect(() => {
    deleteEvent(localStorage.getItem("deleted"));
  }, [deleted]);

  useEffect(() => {
    Teachers();
    const x = localStorage.getItem("TeacherId");
    UpdCalender(x);
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
        const response = await axios.post(
          "http://localhost:3001/appointments/Appointments",
          data
        );
        const x = localStorage.getItem("TeacherId");
        UpdCalender(x);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }, [updatedEvents, events]);

  const deleteEvent = async (event) => {
    try {
      await axios.delete(
        `http://localhost:3001/appointments/Appointments/${localStorage.getItem(
          "deleted"
        )}`
      );
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

      const eventElement = args.div.querySelector(
        ".calendar_default_event_inner"
      );
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
  };

  const calendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {},
    onEventClick: async (args) => {},
  };

  const navigatorConfig = {
    selectMode: "week",
    showMonths: 2,
    skipMonths: 1,
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
      <div>
        <Row>
        <Col lg={5}>
          <h4 style={{ color: "#5b5ea6", marginTop: "5%" }}>Select Teacher</h4>
          <select
            style={inputStyle}
  
            onChange={(e) => {
              setSelectedItem(e.target.value);
              const selectedTeacher = teacherArray.find(
                (teacher) => teacher.teacherId === e.target.value
              );
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
        </Col>
 
          <h6 >
            Selected Teacher : {localStorage.getItem("Teachername")}
          </h6>
       
          </Row>
      </div>

      <div>
        <h4 style={{ color: "#5b5ea6", marginTop: "3%" }}>
          {localStorage.getItem("Teachername")}'s Appointments Schedule
        </h4>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <DayPilotNavigator {...navigatorConfig} />
          </div>
          <div style={{ flexGrow: "1" }}>
            <DayPilotCalendar
              {...calendarConfig}
              ref={calendarRef}
              events={events}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ color: "#5b5ea6", marginTop: "5%" }}>
          Request for Appointment
        </h4>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          <AuthContext.Provider value={{ authState, setAuthState }}>
            <Form>
              <Row style={{ marginTop: "20px" }}>
                <Col lg={6}>
                  <label style={labelStyle}>Student Id :</label>
                  <Field
                    id="inputCreatePost"
                    name="StudentId"
                    readOnly={true}
                    placeholder={authState.user}
                    style={inputStyle}
                    //  validate={validate}
                    value={authState.user}
                  />
                  <ErrorMessage
                    name="StudentId"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Day:</label>
                  <Field
                    type="date"
                    id="inputCreatePost"
                    name="Day"
                    style={inputStyle}
                    validate={validateday}
                  />
                  <ErrorMessage
                    name="Day"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <label style={labelStyle}>Time :</label>
                  <Field
                    type="time"
                    id="inputCreatePost"
                    name="time"
                    style={inputStyle}
                    validate={validatetime}
                  />
                  <ErrorMessage
                    name="time"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label style={labelStyle}>Reason :</label>
                  <Field
                    as="textarea"
                    id="inputCreatePost"
                    name="Note"
                    placeholder="Reson for Appointment"
                    style={inputStyle}
                    validate={validateNote}
                  /> 
                  <ErrorMessage
                  name="Note"
                  component="div"
                  style={{ color: "red" }}
                />
                </Col>
              </Row>
              <Row>
            {" "}
            <div style={{ marginTop: "20px" }}>
              <button type="submit" style={buttonStyle}>
                Request
              </button>
            </div>
          </Row>
            </Form>
          </AuthContext.Provider>
        </Formik>
      </div>
    </>
  );
};

export default RequestAppointment;
