import { v4 as uuidv4 } from 'uuid';
import '../style/App.css';
import '../style/Register.css';
import sha512 from 'crypto-js/sha512';
import { useState, useEffect } from "react";
import {Button, Offcanvas, Container, Row, Col, Card, Form} from "react-bootstrap"

const axios = require('axios')
const CryptoJS = require("crypto-js");




function Register() {
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [email, setemail] = useState("");
    const [address, setaddress] = useState("");
    const [PLZ, setPLZ] = useState("");
    const [password, setpassword] = useState("");
    const [uuid,setuuid] = useState(uuidv4());

    function insert(){
      setpassword(sha512(password).toString())
        axios.post("http://localhost:9000/register", {
          firstname: firstname,
          lastname: lastname,
          email: email,
          address: address,
          password: password,
          OrtIDFS: 1,
          uuid: uuid
        });
        axios.post("http://localhost:9000/sendmail", {
          mail: email
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
            <input placeholder="Firstname" type="text" onChange={(e) => {setfirstname(e.target.value)}}/> 
            </Col>
          </Row>
          <Row>
            <Col>
            <input placeholder="Lastname" type="text" onChange={(e) => {setlastname(e.target.value)}}/>
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
            <input type="submit" onClick={(e)=> {insert()}}></input>
            </Col>
          </Row>
        </form>
        </Container>
        </div>
        </>
  );
}

export default Register;
