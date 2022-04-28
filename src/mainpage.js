import './App.css';
import { useState, useEffect } from "react";

const Cookies = require('js-cookie')
const axios = require('axios')

export default function Mainpage() {

  const [UUID, setUUID] = useState("")
  const [valid, Validation] = useState(false)

  async function checkcookies(){
    if (Cookies.get('user') !== undefined && Cookies.get('user') !== ''){
      setUUID(Cookies.get('user'))
      const result = await axios.post("http://localhost:9000/cookies", {UUID: UUID})
      if (result.data === true){
        Validation(result.data)
      }
    }
  }


  useEffect(() => {
    checkcookies()
  }, );

  if (valid === true){
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
  else {
    return (
      <p>Not Valid Cookie</p>
    )
  }

}
