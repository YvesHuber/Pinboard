import { useState, useEffect } from "react";
import Redirect from './redirect';
import { v4 as uuidv4 } from 'uuid';
import Grid from '@mui/material/Grid'; // Grid version 1
import Card from '@mui/material/Card';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog'; import { styled } from '@mui/material/styles';
import { CardActionArea, Fab } from '@mui/material';
import { db, auth } from "../firebase";
import { TextField } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import AddIcon from '@mui/icons-material/Add';


const axios = require('axios')


export default function Board() {

  const [user, loading, error] = useAuthState(auth);


  const [show, setShow] = useState(false);
  const [name, setName] = useState()
  const [boards, setBoards] = useState()
  const [isLoading, setLoading] = useState(true);
  const [uuid, setuuid] = useState(uuidv4());
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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

    let userobj = {uuid: user.uid, role:"Owner"}

    console.log(userobj)
    addDoc(collection(db, "boards"), {
      BoardUUID: uuid,
      Name: name,
      Users: [userobj]
    })
      .catch((error) => {
        alert(error.message);
      });
  }

  async function getNoteCount(boardUUID){
    let count = 0

    const noteRef = collection(db, "notes");
    const q = query(noteRef, where("BoardID", "==", boardUUID));
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        count++;
        console.log(doc)
      });
    
    return count
  }

  async function getBoards() {
    try {
      let array = []
      onSnapshot(collection(db, "boards"), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.id = doc.id;
          for(let u of object.Users){
            if (u.uuid === user?.uid){

              let count = 0
              getNoteCount(object.BoardUUID).then((value) => {
              count = value
              })

                object.notecount = count
                array.push(object)
                console.log(object)

            }
          }
        });
      });
      onSnapshot(collection(db, "notes"), (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.id = doc.id;
          for (let board of array){
            if(object.BoardID == board.uid){

            }
          }

        });
      });
      setBoards(array)
      console.log(array)

    } catch (err) {
      console.error(err);
    }

  }

  async function deleteBoard() {
    console.log(currentBoard)
    deleteDoc(collection(db, "boards", currentBoard.id));

    handleCloseDelete()
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

  async function navigateto(board) {
    window.location.href = `/board/${board.Name}/${board.BoardUUID}`
  }


  useEffect(() => {
  }, []);

  useEffect(() => {
    if(user !== undefined){
      getBoards()
    }
  }, [user]);


  useEffect(() => {
    if (boards != undefined && boards != []){
      console.log(boards)
      setLoading(false)
    }
  }, [boards]);

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
        <Grid container spacing={-4} direction="column" justifyContent="center" alignItems="center">
          <Grid container direction="row" justifyContent="center" alignItems="center">
            {boards?.map((board, index) => (
              <Grid key={index}>
                <Card variant="outlined" style={{ margin: "10px" }} sx={{ minWidth: 275, maxWidth: 500 }}>
                  <CardActionArea onClick={(e) => navigateto(board)}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        <h3>{board.Name}</h3>
                        <h3>{board.notecount}</h3>
                      </Typography>
                    </CardContent>
                  </CardActionArea>

                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid xs={12}>
            <h2>Create new Board</h2>
          </Grid>
          <Grid xs={12}>


          </Grid>
        </Grid>


        <Dialog onClose={handleCloseUpdate} open={showUpdate}>
          <DialogContent>
            <DialogTitle>Update Board {currentBoard?.title}</DialogTitle>
            <TextField placeholder={currentBoard?.title} type="text" style={{ marginTop: "10px" }} onChange={(e) => { setTitleUpdate(e.target.value) }} /> <br></br>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={(e) => (deleteBoard(createBoard))}> Delete </Button>
            <Button variant="contained" onClick={handleCloseUpdate}>Cancel</Button>
            <Button variant="contained" color="success" onClick={(e) => { editBoard() }}>Update</Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleClose} open={show}>
          <DialogContent>
            <DialogTitle>Create New Board</DialogTitle>
            <TextField style={{ margin: "10px" }} placeholder="Boardname" type="text" onChange={(e) => { setName(e.target.value) }} ></TextField> <br></br>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={(e) => { createBoard() }}>Create new Board</Button>
          </DialogActions>
        </Dialog>
        <Fab color="primary" aria-label="add" onClick={handleShow}>
          <AddIcon />
        </Fab>
      </div>
    </>
  )

}