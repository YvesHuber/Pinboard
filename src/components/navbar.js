import '../style/App.css';
import '../style/Navbar.css';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navigation() {


    return (
        <>
        <Navbar className="Navbar" expand="lg">
            <Container>
                <Navbar.Brand style={{color: "#FFFFFF"}} href="http://localhost:3000">Pinboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav  className="me-auto">
                    <Nav.Link style={{color: "#FFFFFF"}} href="login">Login</Nav.Link>
                    <Nav.Link style={{color: "#FFFFFF"}} href="register">Register</Nav.Link>
                </Nav>
                <Nav className="mr-auto">
                    <Nav.Link style={{color: "#FFFFFF"}} href="user">User</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}