import { useState, useEffect } from "react";
import Boarddisplay from './boarddisplay';
import { checkCookie, checkCookies, getCookie } from "./cookie"
import Redirect from './redirect';
import { v4 as uuidv4 } from 'uuid';
import {Button, Offcanvas} from "react-bootstrap"
const Cookies = require('js-cookie')

const axios = require('axios')

export default function Board() {
  const [show, setShow] = useState(false);
  const [Name, setName] = useState()
  const [Boards, setBoards] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [uuid,setuuid] = useState(uuidv4());
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const UUID = Cookies.get('user')

  async function createBoard() {
    const result = await axios.post("http://localhost:9000/createboards",
      {
        BoardUUID: uuid,
        Name: Name,
        UUID: UUID
      })
      .catch((error) => console.log(error));
  }
  async function getBoards() {
    const result = await axios.get("http://localhost:9000/getboards?UUID=" + UUID)
      .then((response) => response.data)
    setBoards(result)
    console.log(Boards)
    setLoading(false)
  }


  useEffect(() => {
    getBoards()

  }, []);

  if (isLoading) {
    return (
      <div className="App">Loading...</div>
    )
  }
  return (
    <>
      <div className="boards">
        <Redirect link="../login" />
        <h1>Boards</h1>
        <h2>Create new Board</h2>
        <Button variant="primary" onClick={handleShow}>
          Create Board
        </Button>
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Create New Board</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <form>
              <input placeholder="Boardname" type="text" onChange={(e) => { setName(e.target.value) }} /> <br></br>
              <input type="button" value="submit" onClick={(e) => { createBoard() }} />
            </form>
          </Offcanvas.Body>
        </Offcanvas>

        {Boards.map((board, index) => (
          <>
            <h1>{board.Name + board.UUID}</h1>
          </>
        ))}


      </div>
    </>
  )
  //     <Boarddisplay UUID={UUID} />

}