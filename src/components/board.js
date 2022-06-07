import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Redirect from './redirect';
import { v4 as uuidv4 } from 'uuid';
import { Button, Offcanvas, Container, Row, Col, Card } from "react-bootstrap"
const Cookies = require('js-cookie')

const axios = require('axios')

export default function Board() {
  const [show, setShow] = useState(false);
  const [Name, setName] = useState()
  const [Boards, setBoards] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [uuid, setuuid] = useState(uuidv4());
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
    setLoading(true)
    getBoards()

  }
  async function getBoards() {
    const result = await axios.get("http://localhost:9000/getboards?UUID=" + UUID)
      .then((response) => response.data)
    setBoards(result)
    console.log(Boards)
    setLoading(false)

  }


  useEffect(() => {
    if (UUID !== undefined) {
      getBoards()
    }

  }, []);

  if (isLoading) {
    return (
      <>
        <Redirect link="../login" />
        <div className="App">Loading...</div>
      </>
    )
  }
  return (
    <>

      <div className="boards">
        <Container>
          <Row>
            <Redirect link="../login" />
            <h1>Hallo Boards</h1>
            <h2>Create new Board</h2>
            <Button variant="primary" onClick={handleShow}>
              Create Board
            </Button>
          </Row>
          <Row>
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
          </Row>
          <Row>
            {Boards.map((board, index) => (
              <>
                <Link to={`/board/${board.Name}/${board.UUID}`}>
                  <Card style={{ width: '18rem' }}>
                    <Card.Body>
                      <Card.Title>{board.Name}</Card.Title>
                      <Card.Text>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </>
            ))}
          </Row>
        </Container>
      </div>
    </>
  )

}