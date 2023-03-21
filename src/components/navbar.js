import '../style/App.css';
import '../style/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";





export default function Navigation() {

    const [user, error] = useAuthState(auth);




    useEffect(() => {

    }, []);




    return (
        <>
            <Navbar className="Navbar" expand="lg">
                <Container>
                    <Navbar.Brand style={{ color: "#FFFFFF" }} href="http://localhost:3000">Pinboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {user === undefined
                            ? <><Nav className="me-auto">
                                <Nav.Link style={{ color: "#FFFFFF" }} href="login">Login</Nav.Link>
                                <Nav.Link style={{ color: "#FFFFFF" }} href="register">Register</Nav.Link>
                            </Nav>
                                <Nav className="mr-auto">
                                    <Nav.Link style={{ color: "#FFFFFF" }} href="user">User</Nav.Link>
                                </Nav></>
                            : <></>}

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}