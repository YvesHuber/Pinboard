import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Redirect from './redirect';
import { v4 as uuidv4 } from 'uuid';
import { Offcanvas, Container, Row, Col, ModalFooter } from "react-bootstrap"
import Grid from '@mui/material/Grid'; // Grid version 1
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

const axios = require('axios')
const Cookies = require('js-cookie')


export default function Board() {
  const [show, setShow] = useState(false);
  const [Name, setName] = useState()
  const [Boards, setBoards] = useState([])
  const [isLoading, setLoading] = useState(true);
  const [uuid, setuuid] = useState(uuidv4());
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const UUID = Cookies.get('user')
  const [titleUpdate, setTitleUpdate] = useState()

  const [showUpdate, setShowUpdate] = useState(false);

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = (board) => (setCurrentBoard(board), setShowUpdate(true));

  const [showDelete, setShowDelete] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (board) => (setCurrentBoard(board), setShowDelete(true));

  const [currentBoard, setCurrentBoard] = useState()

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
    const result = await axios.get("http://localhost:9000/getboards?uuid=" + UUID)
      .then((response) => response.data)
    console.log(result)
    setBoards(result)
    console.log(Boards)
    setLoading(false)

  }

  async function deleteBoard() {
    console.log(currentBoard)
    handleCloseDelete()
    const result = await axios.delete("http://localhost:9000/deleteboard",
      {
        data: {
          id: currentBoard.id,
        }
      })
      .catch((error) => console.log(error));
    window.location.reload(false);
  }
  async function editBoard() {
    window.location.reload(false);
    handleCloseUpdate()
    const result = await axios.put("http://localhost:9000/updateboard",
      {
        data: {
          id: currentBoard.id,
          title: titleUpdate,
        }
      })
      .catch((error) => console.log(error));
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
            <Col>
              <Redirect link="../login" />
              <h1>Hallo Boards</h1>
              <h2>Create new Board</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="contained" style={{margin:"10px"}} onClick={handleShow}>
                Create Board
              </Button>
            </Col>
          </Row>
          <Row>
            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Create New Board</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <form>
                  <input style={{margin:"10px"}} placeholder="Boardname" type="text" onChange={(e) => { setName(e.target.value) }} ></input> <br></br>
                  <input style={{margin:"10px"}} type="button" value="submit" onClick={(e) => { createBoard() }} ></input>
                </form>
              </Offcanvas.Body>
            </Offcanvas>
          </Row>
          <Row>
            {Boards.map((board, index) => (
              <Card style={{margin:"10px"}} sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <Link to={`/board/${board.Name}/${board.UUID}`}>
                      {board.Name}
                    </Link>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={(e) => (handleShowDelete(board))}>löschen</Button>
                  <Button variant="contained" onClick={(e) => (handleShowUpdate(board))}>editieren</Button>
                </CardActions>
              </Card>
            ))}
          </Row>
          <Modal
            open={showUpdate}
            onClose={handleCloseUpdate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography style={{margin:"10px"}} id="modal-modal-title" variant="h6" component="h2">
                Changeing Borad name
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{margin:"10px"}}>
                Are you sure that you want to change to board name?
                <form>
                  <input placeholder={currentBoard?.title} type="text" style={{marginTop:"10px"}} onChange={(e) => { setTitleUpdate(e.target.value) }} /> <br></br>
                </form>
              </Typography>
              <Button variant="contained" style={{margin:"10px"}} onClick={handleCloseUpdate}>
                Close
              </Button>
              <Button variant="contained" style={{margin:"10px"}} onClick={editBoard}>
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
              <Typography id="modal-modal-title"  style={{margin:"10px"}} variant="h6" component="h2">
                Are you sure?
              </Typography>
              <Typography id="modal-modal-description" style={{margin:"10px"}} sx={{ mt: 2 }}>
                Are you sure you want to delete note {createBoard?.title} ?
              </Typography>
              <Button variant="contained" style={{margin:"10px"}} onClick={handleCloseDelete}>
                Cancel
              </Button>
              <Button variant="contained" style={{margin:"10px"}} onClick={(e) => (deleteBoard(createBoard))}>
                Delete Note
              </Button>
            </Box>
          </Modal>
        </Container>
      </div>
    </>
  )

}