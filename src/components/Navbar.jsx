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
    
  });

  const buttonStyle = {
    padding: "8px 20px",
    backgroundColor: "white",
    color: "#5b5ea6",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
          
        } else {
          setAuthState({
            user: response.data.user,
            status: true,
            id: response.data.id,

            
          });
         
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ ...authState, status: false });
  };

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Navbar
          collapseOnSelect
          expand="xl"
          style={{
            backgroundColor: "#5b5ea6",
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
                <Nav.Link
                  href="/today"
                  style={{ fontSize: "20px", marginRight: "8px" }}
                >
                  Today
                </Nav.Link>

                
                <Nav.Link
                  href="/appointments"
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
                  <NavDropdown.Item href="/studentReg">
                    Student registration
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/termEvoluations">
                    Term evaluations
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/attendance">
                    Attendance
                  </NavDropdown.Item>
                </NavDropdown>

                {!authState.status && (
                  <>
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
                    </NavDropdown>
                  </>
                )}

                <NavDropdown
                  style={{ fontSize: "20px", marginRight: "8px" }}
                  title="About"
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/news">News</NavDropdown.Item>
                  <NavDropdown.Item href="/contact">Contacts</NavDropdown.Item>
                  <NavDropdown.Item href="/classAdd">Classes</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <h1>{authState.user}</h1>
              {!authState.status ? (
                <Nav.Link
                  href="/login"
                  style={{ fontSize: "20px", marginRight: "8px" }}
                >
                  LOGIN
                </Nav.Link>
              ) : (
                <button style={buttonStyle} onClick={logout}>
                  Logout
                </button>
              )}

              <table>
                <Nav>
                  <tr>
                    <td>
                      <NavDropdown
                        title="PRINCIPAL"
                        id="collasible-nav-dropdown"
                      >
                        <NavDropdown.Item exact href="/">
                          Profile
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/payments">
                          Payments
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/#">Logout</NavDropdown.Item>
                      </NavDropdown>
                    </td>
                    <td>
                      <Nav.Link
                        href="/appointments"
                        style={{ fontSize: "20px" }}
                      >
                        <svg
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
                    </td>
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
