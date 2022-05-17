import './App.css';
import { useState, useEffect } from "react";
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';

const axios = require('axios')

export default function Board() {
  const [valid, validation] = useState(true)
  const [Name, setName] = useState()


  async function createBoard(){
    const result = await axios.post("http://localhost:9000/createboard", 
    {
      Name: Name,
      })
    .catch((error) => console.log(error));
  }


  useEffect(() => {
  }, []);
  return (
    <>
    <Redirect link="../login"/>
    <h1>Boards</h1>
    <h2>Create new Board</h2>
    <form>
      <label>Boardname</label>
      <input type="text" onChange={(e) => {setName(e.target.value)}}/> <br></br>
      <input type="button" value="submit" onClick={(e)=> {createBoard()}}/>
      </form>
      
    </>
  )
  
}
