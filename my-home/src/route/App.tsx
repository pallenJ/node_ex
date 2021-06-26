import React from "react";
import { Container, Nav, Navbar, Card, CardGroup,Row,Col } from "react-bootstrap";
import { Route } from "react-router-dom";
import TestSample from '../route/TestSample';

const App = () => {

    return (
        <div>
            <Route path='/' component={Main} exact />
            <Route path='/home' component={Home} />
            <Route path='/testSample' component={TestSample} />
        </div>
    )

}

const pages = [{name:'TestSample', page:<TestSample/>},{name:'none', page:<div/>},{name:'none', page:<div/>},{name:'none', page:<div/>}]
const Main = () =>
(
  <Container >
        <h1>Main</h1>
        <hr/>
        <Row xs={1} md={1} className="g-4">
  {Array.from({ length: pages.length }).map((_, idx) => (
    <Col>
      <Card style = {{width:'75rem'}}>

        <Card.Body>
          <Card.Title>{pages[idx].name}</Card.Title>
            {pages[idx].page}
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
    </Container>
)
const Home = () => (
  <div>
<h1>HOME</h1>
  </div>
);
export default App;