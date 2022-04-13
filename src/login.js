import './App.css';
import { useState, useEffect } from "react";
const Cookies = require('js-cookie')
const axios = require('axios')

function Login() {
    const [firstname, setfirstname] = useState("")
    const [password, setpassword] = useState("");
    const [userid, setuserid] = useState("");

    async function makecall () {
        const res = await axios.post("http://localhost:9000/login",
        {firstname: firstname,
        password: password})
        .then((response) => setuserid(response.data))
        .catch((error) => console.log(error))
        .then(Cookies.set('user', userid, {expires:1, path:''}))

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
              <p>{userid}</p>
              </>
        );


}

export default Login;
