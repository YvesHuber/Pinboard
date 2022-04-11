import './App.css';
import { useState, useEffect } from "react";
import  { Navigate } from 'react-router-dom';

const Cookies = require('js-cookie')
const axios = require('axios')

export default function Mainpage() {

  const [UUID, setUUID] = useState("")

  async function checkcookies(){
    setUUID(Cookies.get('user'))
    await axios.post("http://localhost:9000/cookies", {UUID: UUID})

  }


  useEffect(() => {
    checkcookies()
  }, []);

  if(UUID == ""){
    return <Navigate to='/login'  />
  }
  else {
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
