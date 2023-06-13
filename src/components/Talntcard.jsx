import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import pr from '../images/pr.jpg'



function TlntGrd() {
  return (

 
    <Row style={{padding:"15px 10px"}}>
      {Array.from({ length: 4 }).map((_, idx) => (
        <Col key={idx} xs={12} md={6} lg={3} >
          <Card >
           <Card.Img  variant="top" src={pr} />
            <Card.Body> 
              <Card.Title>Savindu Harith</Card.Title>
              <Card.Text>
                This is a longer card with supporting text below as a natural
                lead-in to additional content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
   
  );
}

export default TlntGrd;