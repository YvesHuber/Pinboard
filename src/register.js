import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useState, useEffect } from "react";
const axios = require('axios')
const CryptoJS = require("crypto-js");




function Register() {
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [email, setemail] = useState("");
    const [address, setaddress] = useState("");
    const [password, setpassword] = useState("");
    const [uuid,setuuid] = useState(uuidv4());

    function insert(){
      setfirstname(CryptoJS.SHA1(firstname).toString())
      setlastname(CryptoJS.SHA1(lastname).toString())
      setemail(CryptoJS.SHA1(email).toString())
      setaddress(CryptoJS.SHA1(address).toString())
      setpassword(CryptoJS.SHA1(password).toString())
      console.log(firstname)
      console.log(lastname)
      console.log(uuid)
        axios.post("http://localhost:9000/register", {
          firstname: firstname,
          lastname: lastname,
          email: email,
          address: address,
          password: password,
          OrtIDFS: 1,
          uuid: uuid
        });
        
    }

  return (
      <>
        <form>
            <label>firstname</label>
            <input type="text" onChange={(e) => {setfirstname(e.target.value)}}/> <br></br>
            <label>lastname</label>
            <input type="text" onChange={(e) => {setlastname(e.target.value)}}/> <br></br>
            <label>email</label>
            <input type="text" onChange={(e) => {setemail(e.target.value)}}/> <br></br>
            <label>address</label>
            <input type="text" onChange={(e) => {setaddress(e.target.value)}}/> <br></br>
            <label>password</label>
            <input type="text" onChange={(e) => {setpassword(e.target.value)}}/> <br></br>
            <input type="submit" onClick={(e)=> {insert()}}></input>
        </form>
        <p>{uuid}</p>
        </>
  );
}

export default Register;
