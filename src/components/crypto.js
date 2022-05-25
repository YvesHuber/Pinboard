import '../style/App.css';
import '../style/Style.css';
import { useState, useEffect } from "react";
import sha512 from 'crypto-js/sha512';
import {Button, Offcanvas, Container, Row, Col} from "react-bootstrap"

const CryptoJS = require("crypto-js");


export default function Boarddisplay() {
  const [description, setDescription] = useState()


  async function convert(){
      console.log(sha512(description).toString())
    setDescription(sha512(description).toString())

  }



  useEffect(() => {
  }, []);

  return (
    <>
    <Container>
        <input type="text" onChange={(e) => setDescription(e.target.value)} />
        <input type="submit" value="decrypt" onClick={(e)=> {convert()}} />
        <p>{description}</p>
    </Container>
    </>
  )
  
}