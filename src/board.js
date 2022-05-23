import './App.css';
import { useState, useEffect } from "react";
import Boarddisplay from './boarddisplay';
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';
const Cookies = require('js-cookie')

const axios = require('axios')

export default function Board() {
  const [valid, validation] = useState(true)
  const [Name, setName] = useState()
  const [UserID, setUserID] = useState()
  const UUID = Cookies.get('user')

  async function createBoard(){
    const result = await axios.post("http://localhost:9000/createboards", 
    {
      Name: Name,
      UUID: UUID
      })
    .catch((error) => console.log(error));
  }
  async function getBoards(){
    const result = await axios.get("http://localhost:9000/getid?UUID="+UUID)
    .then((response) => response.data)
    console.log(result[0].ID)
    setUserID(result[0].ID)
  }


  useEffect(() => {
  getBoards()

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
  //     <Boarddisplay UUID={UUID} />

}