import {Container} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import pr from '../images/pr.jpg'

function NavigationBar() {
  return (
    <Navbar collapseOnSelect expand="xl" style={{backgroundColor:"#5b5ea6" , position:"fixed" , top: 0, width: "100%"}}  variant="dark" >
      <Container>
    
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            
            {/* <Nav.Link href="/art-gallery" style={{fontSize:"20px" , marginRight:"8px"}}>Art gallery</Nav.Link>
            <Nav.Link href="/talent-page" style={{fontSize:"20px", marginRight:"8px"}}>Talents</Nav.Link> */}
            <Nav.Link href="/today" style={{fontSize:"20px", marginRight:"8px"}} >Today</Nav.Link>
            {/* <Nav.Link href="/term-evaluations" style={{fontSize:"20px", marginRight:"8px"}}>Term evaluations</Nav.Link> */}
            <Nav.Link href="/appointments" style={{fontSize:"20px", marginRight:"8px"}}>Appointments</Nav.Link>

            <NavDropdown style={{fontSize:"20px", marginRight:"8px"}} title="Student details" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/studentReg" >Student registration</NavDropdown.Item>
              <NavDropdown.Item href="/studentDetails" >Student details</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown style={{fontSize:"20px", marginRight:"8px"}} title="Teacher details" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/teacherReg" >Teacher Registration</NavDropdown.Item>
              <NavDropdown.Item href="/teacherDetails" >Teacher details</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown style={{fontSize:"20px", marginRight:"8px"}} title="About" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/news" >News</NavDropdown.Item>
              <NavDropdown.Item href="/contact">Contact</NavDropdown.Item>
              <NavDropdown.Item href="/classAdd">Class details</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <table>
           <Nav>
            <tr>
                
                <td>
                <NavDropdown title="PRINCIPAL" id="collasible-nav-dropdown">
                <NavDropdown.Item exact href="/" >Profile</NavDropdown.Item>
                <NavDropdown.Item href="/payments">Payments</NavDropdown.Item>
                <NavDropdown.Item href="/#">Logout</NavDropdown.Item>
                </NavDropdown>
                </td>
                <td>
                <Nav.Link href="/appointments" style={{fontSize:"20px"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                </svg> </Nav.Link>
                </td>
            </tr>
          </Nav>
          </table>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;