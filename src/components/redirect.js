import '../style/App.css';
import '../style/Style.css';import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const axios = require('axios')
const Cookies = require('js-cookie')

export default function Redirect(props) {
  const [valid, validation] = useState("")


  async function setup(){
      validation(true)
  }

  useEffect(() => {
    setup()

  }, []);

  if (valid === ""){
    return (
      <p>loading</p>
    )
  }
  else if (valid){
    return (
      <>
      </>
    )
  }
  else {
    return(
      <Navigate to={props.link}/>
    )
  }
  
}


