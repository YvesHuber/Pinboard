import './App.css';
import { useState, useEffect } from "react";
const axios = require('axios')





function Login() {
    const [firstname, setfirstname] = useState("")
    const [password, setpassword] = useState("");

    function login(e){
        const fetchPosts = async () => {
            const res = await axios.get("http://localhost:9000/login")
            console.log(res.data)
            return res.data;
        };
        let users = fetchPosts();
        users.forEach(function(user){
            if(user.firstname === firstname && user.password === password){
                console.log("login lol")
            }
        })
 

    }

  return (
        <form>
            <label>firstname</label>
            <input type="text" onChange={(e) => {setfirstname(e.target.value)}}/> <br></br>
            <label>password</label>
            <input type="text" onChange={(e) => {setpassword(e.target.value)}}/> <br></br>
            <input type="button"  onClick={(e)=> {login(e)}}/>
        </form>
  );
}

export default Login;
