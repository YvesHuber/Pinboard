import '../style/App.css';
import '../style/User.css';
import { useState, useEffect } from "react";
import { Navbar, Offcanvas, Container, Nav, Row, Col, NavDropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Redirect from './redirect';
const Cookies = require('js-cookie')
const axios = require('axios')

export default function User(props) {

    const handleClose = () => props.show = false
    const [password1, setPassword1] = useState()
    const [password2, setPassword2] = useState()



    async function resetPassword(){

    }



    return (
        <>
        <Row>
            
          </Row>
        </>
    )
}