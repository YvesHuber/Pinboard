import '../style/App.css';
import { useState, useEffect } from "react";
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';
import {Offcanvas, Container, Row, Col} from "react-bootstrap"
import { useHistory, useParams } from 'react-router-dom'
import Button from '@mui/material/Button';


const Cookies = require('js-cookie')
const axios = require('axios')


function Invite() {

    const UUID = Cookies.get('user')
    const { id } = useParams()
    const [currentBoard,setCurrentBoard] = useState()

    useEffect(() => {
    }, []);

    async function getBoard(){

    }
  
    async function join() {
    console.log("joining board")
    console.log(id)
      const result = await axios.get("http://localhost:9000/invitetoboard?useruuid="+UUID+"&boarduuid="+id)
          .then((response) => response.data)
          console.log(result)
    }


  return (
  <div className='App'>
    <h1>You have been invited to the Board</h1>
    <h2>Do you wish to join the board?</h2>
    <Button variant="contained" onClick={(e) => join()} >Join Board</Button>
    <p>{UUID}</p>
    <p>{id}</p>



    
  </div>
  );
}

export default Invite;
