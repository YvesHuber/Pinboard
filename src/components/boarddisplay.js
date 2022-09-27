import '../style/App.css';
import '../style/Style.css';
import { useState, useEffect } from "react";
import {checkCookie, checkCookies, getCookie} from "./cookie"
import Redirect from './redirect';
import {Offcanvas, Container, Row, Col} from "react-bootstrap"
import { useHistory, useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


const Cookies = require('js-cookie')

const axios = require('axios')

export default function Boarddisplay() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showUpdate, setShowUpdate] = useState(false);

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = (note) => (setCurrentNote(note), setShowUpdate(true));

  const [showDelete, setShowDelete] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (note) => (setCurrentNote(note), setShowDelete(true));

  const [loading, setLoading] = useState(true)
  const UUID = Cookies.get('user')
  const { uuid } = useParams()
  const { name } = useParams()
  const [currentNote, setCurrentNote] = useState()
  const [currentBoard, setCurrentBoard] = useState()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [titleUpdate, setTitleUpdate] = useState()
  const [descriptionUpdate, setDescriptionUpdate] = useState()


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
        BoardID: currentBoard.id

      })
      .catch((error) => console.log(error));
      setLoading(true)
      getNotes()
  }

  async function getBoards() {
    const result = await axios.get("http://localhost:9000/getboards?uuid=" + UUID)
      .then((response) => response.data)
      console.log(result)
    for(let res of result){
      if (res.UUID == uuid){
        console.log(res)
        setCurrentBoard(res)
      }
    }
    setLoading(false)

  }

  async function deleteNote(note){
    handleCloseDelete()
    console.log(note)
    const result = await axios.delete("http://localhost:9000/deleteNote",
      {data: {
        id: note.id,
        title: note.title,
        description: note.description
      }
      })
      .catch((error) => console.log(error));
      setLoading(true)
      getNotes()
  }
  
  async function editNote(){
  handleCloseUpdate()
  console.log(titleUpdate)
  console.log(descriptionUpdate)

    const result = await axios.put("http://localhost:9000/updatenote",
      {data: {
        id: currentNote.id,
        title: titleUpdate,
        description: descriptionUpdate
      }
      })
      .catch((error) => console.log(error));

      console.log(result)
      setLoading(true)
      getNotes()
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



  useEffect(() => {
    getNotes()
    getBoards()
  }, []);
  if (loading){
    return (
      <h1>Loading</h1>
    )
  }
  return (
    <>
      <Container>
        <Redirect link="../login" />
        <Row>
          <h1>{name}</h1>
        </Row>
        <Row>
        {notes.map((note, index) => (
          <>
          <Col>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {note.title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="error" onClick={(e) => (handleShowDelete(note))}>löschen</Button>
                <Button variant="contained" color="success" onClick={(e) => (handleShowUpdate(note))}>editieren</Button>
              </CardActions>
            </Card>
            </Col>
          </>
        ))}
        </Row>
        <Button variant="contained" aria-label="add" style={{margin:"10px"}} onClick={handleShow}>
          <AddIcon />
        </Button>
        <Modal
          open={show}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography style={{ margin: "10px" }} id="modal-modal-title" variant="h6" component="h2">
              Create New Note
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form>
                <input placeholder="Title" type="text" style={{ margin: "10px" }} onChange={(e) => { setTitle(e.target.value) }} ></input> 
                <br></br>
                <textarea placeholder="Description" style={{ margin: "10px" }} rows="3" cols="30" onChange={(e) => { setDescription(e.target.value) }}> </textarea> 
              </form>
            </Typography>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={createNote}>
              Create Note
            </Button>
          </Box>
        </Modal>
        <Modal
          open={showUpdate}
          onClose={handleCloseUpdate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography style={{ margin: "10px" }} id="modal-modal-title" variant="h6" component="h2">
              Edit Board
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ margin: "10px" }}>
              <form>
                <input placeholder={currentNote?.title} style={{ margin: "10px" }} type="text" onChange={(e) => { setTitleUpdate(e.target.value) }} ></input> 
                <br></br>
                <textarea placeholder={currentNote?.description} style={{ margin: "10px" }} rows="3" cols="30" onChange={(e) => { setDescriptionUpdate(e.target.value) }} ></textarea>
              </form>
            </Typography>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseUpdate}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={editNote}>
              Save Changes
            </Button>
          </Box>
        </Modal>
        <Modal
          open={showDelete}
          onClose={handleCloseDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography style={{ margin: "10px" }} id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete note {currentNote?.title} ?
            </Typography>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseDelete}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={(e) => (deleteNote(currentNote))}>
              Delete
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  )
  
}