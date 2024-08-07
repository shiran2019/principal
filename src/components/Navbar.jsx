import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import React, { useState, useEffect } from "react";

function NavigationBar() {
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
        } else if (response.data.role == "Student") {
          document.getElementById("nav").style.backgroundColor = "#34568b";
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role == "Admin") {
          document.getElementById("nav").style.backgroundColor = "#9b2335";
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role == "Teacher") {
          document.getElementById("nav").style.backgroundColor = "#5b5ea6";
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else console.log("fsgfgfg");
      }).catch((error) => {
        alert(error);
      }
      
      )
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ ...authState, user: "", status: false, role: "" });
  };

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Navbar
          collapseOnSelect
          expand="xl"
          id="nav"
          style={{
            backgroundColor: "#5b5ea6",
            zIndex: 2,
            position: "fixed",
            top: 0,
            width: "100%",
          }}
          variant="dark"
        >
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {authState.status && (
                  <>
                    <Nav.Link
                      href="/today"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Today
                    </Nav.Link>
                  </>
                )}

             

             
              

                {!authState.status && (
                  <>
                    <Nav.Link
                      href="/login"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Login
                    </Nav.Link>
                  </>
                )}

                {authState.role === "Teacher" && (
                  <>
                  
                    <Nav.Link
                      href="/appointmentsTeacher"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Appointments
                    </Nav.Link>
                
                
                <NavDropdown
                      style={{ fontSize: "20px", marginRight: "8px" }}
                      title="Students"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="/studentDetails">
                        Our students
                      </NavDropdown.Item>
                     
                      <NavDropdown.Item href="/termEvoluations">
                        Term evaluations
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/bestKids">
                        Best kids
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/art-gallery">
                      Art Gallery
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/Studentattendance">
                        Attendance
                      </NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link
                      href="/announcement"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Announcements
                    </Nav.Link>
                    
                
                  </>
                )}




                {authState.role === "Admin" && (
                  <>
                  <Nav.Link
                      href="/"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Dashboard
                    </Nav.Link>
                   

                <NavDropdown
                      style={{ fontSize: "20px", marginRight: "8px" }}
                      title="Teachers"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="/teacherDetails">
                        Our teachers
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/teacherReg">
                        Teacher Registration
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/adminAppointments">
                      Appointments
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/teacherattendance">
                        Attendance
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/teacherSalary">
                        Salary
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown
                      style={{ fontSize: "20px", marginRight: "8px" }}
                      title="Students"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="/studentDetails">
                        Our students
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/studentReg">
                        Student registration
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/termEvoluations">
                        Term evaluations
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/bestKids">
                        Best kids
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/art-gallery">
                      Art Gallery
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/Studentattendance">
                        Attendance
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/payments">
                        Payment Details
                      </NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link
                      href="/classAdd"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Classes
                    </Nav.Link>
                    <Nav.Link
                      href="/announcement"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Announcements
                    </Nav.Link>
                    <Nav.Link
                      href="/meetings"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Meetings
                    </Nav.Link>
                    
                    <Nav.Link
                      href="/daycareadmin"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Daycare
                    </Nav.Link>

                  </>
                )}




                {authState.role === "Student" && (
                  <>
                
                    <Nav.Link
                      href="/appointments"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Appointments
                    </Nav.Link>
                    <Nav.Link
                      href="/myResults"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Term evaluations
                    </Nav.Link>
 <NavDropdown
                      style={{ fontSize: "20px", marginRight: "8px" }}
                      title="Talents"
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item href="/myArts">
                        My arts
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/talents">
                        Talented kids
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link
                      href="/myPayments"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Payments
                    </Nav.Link>

                    <Nav.Link
                      href="/announcement"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Announcements
                    </Nav.Link>
                    <Nav.Link
                      href="/daycare"
                      style={{ fontSize: "20px", marginRight: "8px" }}
                    >
                      Daycare
                    </Nav.Link>

                  </>

                )}

              </Nav>

              <table>
                <Nav>
                  <tr>
                  <td>
                      {authState.status && (
                        <>
                          <Nav.Link
                            // href="/profile"
                            style={{ fontSize: "20px", marginRight: "8px" , fontWeight:"bold" }}
                          >
                            {authState.role}
                          </Nav.Link>
                        </>
                      )}
                    </td>
                    <td>
                      <NavDropdown
                        title={authState.user}
                        id="collasible-nav-dropdown"
                      >
                        <NavDropdown.Item exact href="/">
                          Profile
                        </NavDropdown.Item>

                        {authState.status ? (
                          <NavDropdown.Item onClick={logout} href="/#">
                            Logout
                          </NavDropdown.Item>
                        ) : (
                          <NavDropdown.Item href="/login">
                            Login
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    </td>
                  
                    {/* <td>
                      <Nav.Link
                        href="/appointments"
                        style={{ fontSize: "20px" }}
                      >
                        <svgs
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-bell-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                        </svg>{" "}
                      </Nav.Link>
                    </td> */}
                  </tr>
                </Nav>
              </table>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </AuthContext.Provider>
    </>
  );
}

export default NavigationBar;
