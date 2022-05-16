import './App.css';
import { useState, useEffect } from "react";
import {checkCookies, getCookie} from "./cookie"

const axios = require('axios')

export default function Board() {
  const [valid, validation] = useState(true)
  const [UUID, setUUID] = useState()




  useEffect(() => {
    setUUID=getCookie()
  }, );

    return (
      <>
      <p>Boards</p>
      {UUID}


      </>
      
    )
  
}
