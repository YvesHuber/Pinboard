import '../style/App.css';
import '../style/Login.css';
import { useState } from "react";
import { logInWithEmailAndPassword } from '../firebase';
import { Button, Offcanvas, Container, Row, Col } from "react-bootstrap"


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");

    async function makecall() {
        logInWithEmailAndPassword(email,password)

    }

    return ( 
        <>
        <div className = "Login">
            <Container>
                <Row>
                    <h2>Login</h2>
                </Row>
                <form>
                    <Row>
                        <Col>
                        <input placeholder="Enter email" type = "text"onChange = {(e) => { setEmail(e.target.value) } }/> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <input placeholder="Password" type = "password"onChange = {(e) => { setPassword(e.target.value) } }/> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Button value="Login" onClick = {(e) => { makecall() } }/> 
                        </Col>
                    </Row>
                </form> 
                <Row className="LoginComment">
                    <Col>
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