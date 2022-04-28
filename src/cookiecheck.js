import './App.css';
import { useState, useEffect } from "react";
import Navigate from "react-dom";

const Cookies = require('js-cookie')
const axios = require('axios')

export default function Cookie() {

  const [UUID, setUUID] = useState("")
  const [valid, Validation] = useState(true)

  async function checkcookies(){
    if (Cookies.get('user') !== undefined && Cookies.get('user') !== ''){
      setUUID(Cookies.get('user'))
      const result = await axios.post("http://localhost:9000/cookies", {UUID: UUID})
      if (result.data === true){
        Validation(result.data)
      }
      else {
          Validation(false)
      }
    }
    else{
        Validation(false)
    }
  }


  useEffect(() => {
    checkcookies()
  }, );

  if (valid === true){
  return (
    <>
    <p>Cookie</p>
    </>
  );
  }
  else if (valid === false) {
    return (
    <>
    <p>No Cookie</p>
    </>
    )
  }
  else {
    <>
    </>
  }
}
