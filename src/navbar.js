import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function Navigation() {


    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="http://localhost:3000">Pinbaord</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="Login">Login</Nav.Link>
                    <Nav.Link href="Register">Register</Nav.Link>
                    <Nav.Link href="Board">Boards</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}