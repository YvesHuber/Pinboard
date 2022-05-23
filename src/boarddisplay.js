import './App.css';
import { useState, useEffect } from "react";
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';
const Cookies = require('js-cookie')

const axios = require('axios')

export default function Boarddisplay(props) {
  const UUID = Cookies.get('user')

  async function getBoards(){
    const result = await axios.get("http://localhost:9000/getboards", { params: { UUID: UUID } })
  }


  useEffect(() => {

  }, []);
  return (
    <>
    <h1>Boards</h1>
    <h2>{props.UUID}</h2>

    </>
  )
  
}