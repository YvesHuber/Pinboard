import '../style/App.css';
import '../style/Login.css';
import { useState } from "react";

import sha512 from 'crypto-js/sha512';
import { Button, Offcanvas, Container, Row, Col } from "react-bootstrap"
const Cookies = require('js-cookie')
const axios = require('axios')
const CryptoJS = require("crypto-js");


function Login() {
    const [firstname, setfirstname] = useState("")
    const [password, setpassword] = useState("");
    const [userid, setuserid] = useState("");

    async function makecall() {
        setpassword(sha512(password).toString())
        const res = await axios.post("http://localhost:9000/login", { firstname: firstname, password: password })
            .catch((error) => console.log(error));
        const testdata = await res.data;
        if(testdata !== "ERR"){
        console.log(testdata)
        setuserid(testdata)
        Cookies.set('user', [testdata], { expires: 1 })
        }
    }

    return ( 
        <>
        <div className = "Login">
            <Container>
                <Row>
                    <h2 > Login </h2>
                </Row>
                <form>
                    <Row>
                        <Col>
                        <input placeholder="Enter username" type = "text"onChange = {(e) => { setfirstname(e.target.value) } }/> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <input placeholder="Password" type = "password"onChange = {(e) => { setpassword(e.target.value) } }/> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <input type="button" value="Login" onClick = {(e) => { makecall() } }/> 
                        </Col>
                    </Row>
                </form> 
                <Row className="LoginComment">
                    <Col >
                    <p>Not registered yet?</p>
                    </Col>
                    <Col style={{color: "#03FF3B"}}>
                    <p><a href="http://localhost:3000/register">Register</a></p>
                    </Col>
                </Row>
            </Container>
        </div> 
        </>
    );


}

export default Login;