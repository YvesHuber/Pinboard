import './App.css';
import { useState, useEffect } from "react";
const axios = require('axios')

function Login() {
    const [firstname, setfirstname] = useState("")
    const [password, setpassword] = useState("");
    const [users, setusers] = useState("");
    const [status, setstatus] = useState(false);

    async function makecall () {
        return fetch("http://localhost:9000/login?firstname="+firstname+"&password="+password)
        .then(res => console.log(res))
    }

        return (
            <>
              <form>
                  <label>firstname</label>
                  <input type="text" onChange={(e) => {setfirstname(e.target.value)}}/> <br></br>
                  <label>password</label>
                  <input type="text" onChange={(e) => {setpassword(e.target.value)}}/> <br></br>
                  <input type="button" value="submit" onClick={(e)=> {makecall()}}/>
              </form>
              </>
        );


}

export default Login;
