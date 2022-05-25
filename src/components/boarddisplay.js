import '../style/App.css';
import '../style/Style.css';
import { useState, useEffect } from "react";
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';
import {Button, Offcanvas, Container, Row, Col, Card} from "react-bootstrap"
import { useHistory, useParams } from 'react-router-dom'

const Cookies = require('js-cookie')

const axios = require('axios')

export default function Boarddisplay() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(true)
  const { uuid } = useParams()
  const { name } = useParams()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()


  async function getNotes(){
    const result = await axios.get("http://localhost:9000/getnotes?UUID=" + uuid)
    .then((response) => response.data)
    console.log(result)
    setNotes(result)
  console.log(notes)
  setLoading(false)
  }
  async function createNote(){
    const result = await axios.post("http://localhost:9000/createnote",
      {
        Title: title,
        Description: description,
        BoardUUID: uuid
      })
      .catch((error) => console.log(error));
      setLoading(true)
      getNotes()
  }


  useEffect(() => {
    getNotes()
  }, []);
  if (loading){
    return (
      <h1>Loading</h1>
    )
  }
  return (
    <>
    <Container>
    <Redirect link="../login"/>
    <Row>
    <h1>{name}</h1>
    </Row>
    {notes.map((note, index) => (
      <>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{note.title}</Card.Title>
        <Card.Text>
         {note.description}
        </Card.Text>
      </Card.Body>
    </Card>
    </>
    ))}
     <Button variant="primary" onClick={handleShow}>
          Create Note
        </Button>
        <Row>
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Create New Board</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <form>
              <input placeholder="Title" type="text" onChange={(e) => { setTitle(e.target.value) }} /> <br></br>
              <textarea placeholder="Description"  rows="3" cols="30" onChange={(e) => { setDescription(e.target.value) }} /> <br></br>
              <input type="button" value="submit" onClick={(e) => { createNote() }} />
            </form>
          </Offcanvas.Body>
        </Offcanvas>
        </Row>
    </Container>
    </>
  )
  
}