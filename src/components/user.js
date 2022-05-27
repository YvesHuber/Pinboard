import '../style/App.css';
import '../style/User.css';
import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Row, Col, NavDropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Redirect from './redirect';
const Cookies = require('js-cookie')
const axios = require('axios')

export default function User() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setAdmin] = useState(false)
    const [islogout, setlogout] = useState()
    const [user, setUser] = useState()

    async function getUser(){
        let UUID = await Cookies.get('user')
        console.log(UUID)
        let response = await axios.get("http://localhost:9000/getuser?UUID="+UUID)
        .then((response) => response.data)
        setUser(response[0])
        console.log(response[0].Admin)
        if(response[0].Admin == 1){
            setAdmin(true)
        }
        setLoading(false)
    }

    async function resetPassword(){
    }


    async function logout(){
        Cookies.remove('user', { path: '' })
        setlogout(true)
    }

    useEffect(() => {
        getUser()
      }, []);


    if(loading) {
        return (
            <p>Loading....</p>
        )
    }

    if(islogout){
        return(
            <>
            <p>You have been logged out</p>
            </>
        )
    }

    return (
        <>
        <Redirect link="../login" />
        <Container>
            <Row>
                <Col>
                <h2>Hello {user.firstname}</h2>
                <p>Reset Email</p>
                <p>Reset Password</p>
                </Col>
                <Row>
                <Col>
                <Button variant="primary" onClick={logout}>
                    Reset Password
                </Button>
                </Col>
                </Row>
                
                <Row>
                <Col>
                <Button variant="primary" onClick={logout}>
                    logout
                </Button>
                </Col>
                </Row>
                <div>
                {isAdmin ? <p>you are an Admin</p> : <p>you are not an Admin</p> }
                </div>
            </Row>
        </Container>
        </>
    )
}