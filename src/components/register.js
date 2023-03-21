import { v4 as uuidv4 } from 'uuid';
import '../style/App.css';
import '../style/Register.css';
import { useState, useEffect } from "react";
import { registerWithEmailAndPassword } from '../firebase';
import {Button, Offcanvas, Container, Row, Col, Card, Form} from "react-bootstrap"
import {
  collection,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";



function Register() {
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [address, setaddress] = useState("");
    const [PLZ, setPLZ] = useState("");
    const [password, setpassword] = useState("");

    function insert(){
     registerWithEmailAndPassword(name,email,password)
      .catch((error) => {
        alert(error.message);
      });
    }

  return (
      <>
      <div className="Register">
      <Container>
        <Row>
          <h2 >Register</h2>
        </Row>
  
        <form>
          <Row>
            <Col>
            <input placeholder="name" type="text" onChange={(e) => {setName(e.target.value)}}/> 
            </Col>
          </Row>
          <Row>
            <Col>
            <input placeholder="Email" type="text" onChange={(e) => {setemail(e.target.value)}}/> 
            </Col>
          </Row>
          <Row>
            <Col>
            <input placeholder="Password" type="password" onChange={(e) => {setpassword(e.target.value)}}/> 
            </Col>
          </Row>          
          <Row>
            <Col>
            <input placeholder="Address" type="text" onChange={(e) => {setaddress(e.target.value)}}/> 
            </Col>
            <Col>
            <input placeholder="PLZ" type="text" onChange={(e) => {setPLZ(e.target.value)}}/> 
            </Col>
          </Row>
          <Row>
            <Col>
            <Button onClick={(e)=> {insert()}}>Submit</Button>
            </Col>
          </Row>
        </form>
        </Container>
        </div>
        </>
  );
}

export default Register;
