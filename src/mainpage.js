import './App.css';
import { useState, useEffect } from "react";
import  { Navigate } from 'react-router-dom';

const Cookies = require('js-cookie')
const axios = require('axios')

export default function Mainpage() {

  const [UUID, setUUID] = useState("")
  const [state, setstate] = useState("status")
  async function checkcookies(){
    const user = Cookies.get('user')
    console.log(user)
    await axios.post("http://localhost:9000/cookies", {UUID: user})
    .then(response => setstate(response.data))
    
    if (state != "status"){
      console.log(state)
    }


  }


  useEffect(() => {
    checkcookies()
  }, []);

  /*
  if (state != "status"){
    if (state == false){
      return <p>login</p>
    }
    else if (state == true){
      return (
        <>
            <h1>
                Mainpage
            </h1>
            <h2>
              This is a page
            </h2>
            <p>
              {UUID}
            </p>
          </>
      );
      }
  }
  else {
    return( <p>Loading</p>)
  }
  */
 return(<p>p</p>)
}
