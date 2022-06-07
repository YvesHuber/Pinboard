import '../style/App.css';
import '../style/User.css';
import { useState, useEffect } from "react";
import resetPassword from './resetpassword'
import { Navbar, Offcanvas, Container, Nav, Alert, Row, Col, NavDropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Redirect from './redirect';
const Cookies = require('js-cookie')
const axios = require('axios')

export default function User() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setAdmin] = useState(false)
    const [islogout, setlogout] = useState()
    const [user, setUser] = useState()
    const [resetPasswordShow, setresetPasswordShow] = useState(false)
    const handleClosePassword = () => setresetPasswordShow(false);
    const handleShowPassword = () => setresetPasswordShow(true);
    const [password1, setPassword1] = useState()
    const [password2, setPassword2] = useState()
    const [resetPasswordError, setresetPasswordError] = useState(false)
    const [resetPasswordSuccess, setresetPasswordSuccess] = useState(false)
    const UUID = Cookies.get('user')





    async function getUser() {
        let UUID = await Cookies.get('user')
        console.log(UUID)
        let response = await axios.get("http://localhost:9000/getuser?UUID=" + UUID)
            .then((response) => response.data)
        setUser(response[0])
        console.log(response[0].Admin)
        if (response[0].Admin == 1) {
            setAdmin(true)
        }
        setLoading(false)
    }

    async function resetPassword() {

        if (password1 !== password2){
            setresetPasswordError(true)
        }else if (password1 === password2){
            setresetPasswordSuccess(true)
            setresetPasswordError(false)
            const result = await axios.post("http://localhost:9000/updatepassword",
            {
                Password: password1,
                UUID: UUID
            }).catch((error) => console.log(error));
            
            setPassword1("")
            setPassword2("")
        }

    }

    async function logout() {
        Cookies.remove('user', { path: '' })
        setlogout(true)
    }

    useEffect(() => {
        getUser()
    }, []);

    if (loading) {
        return (
            <p>Loading....</p>
        )
    }

    if (islogout) {
        return (
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
                            <Button variant="primary" onClick={handleShowPassword}>
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
                        {isAdmin ? <p>you are an Admin</p> : <p>you are not an Admin</p>}
                    </div>
                </Row>
                <Row>
                    <Offcanvas show={resetPasswordShow} onHide={handleClosePassword}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Reset Password</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <form>
                                <Row>
                                    <Col>
                                        <label>Enter new Password</label>
                                    </Col>
                                    <Col>
                                        <input type="password" onChange={(e) => { setPassword1(e.target.value) }} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <label>Enter new Password again</label>
                                    </Col>
                                    <Col>
                                        <input type="password" onChange={(e) => { setPassword2(e.target.value) }} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    {resetPasswordError
                                    ? <Alert variant="danger">The 2 Passwords do not match</Alert>
                                    : <></>
                                    }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <input type="button" value="Reset" onClick={(e) => { resetPassword() }} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    {resetPasswordSuccess
                                    ? <Alert variant="success">The password was successfuly changed</Alert>
                                    : <></>
                                    }
                                    </Col>
                                </Row>
                            </form>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Row>
            </Container>
        </>
    )

}