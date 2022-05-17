import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const axios = require('axios')
const Cookies = require('js-cookie')

export default function Redirect(props) {
  const [valid, validation] = useState("")


  async function setup(){
    let UUID = await Cookies.get('user')
    console.log(UUID)
    let response = await axios.post("http://localhost:9000/cookies", {
            UUID: UUID
        })
        .then((data) =>  data.data) 
        .catch((err) => console.error(err));
    console.log(response)
    if (response === true){
      validation(true)
    }
    else {
      validation(false)
    }
  
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


