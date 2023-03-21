import '../style/App.css';
import '../style/Board.css';
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  where,
  deleteDoc,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  arrayRemove
} from "firebase/firestore";
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { db, auth, getAuth } from "../firebase";
import Redirect from './redirect';
import { useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Edit } from '@mui/icons-material';
import { Grid, TextField } from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";

export default function Boarddisplay() {

  const [user, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showUpdate, setShowUpdate] = useState(false);

  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = (note) => (setCurrentNote(note), setShowUpdate(true));

  const [showDelete, setShowDelete] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (note) => (setCurrentNote(note), setShowDelete(true));

  const [showDeleteB, setShowDeleteB] = useState(false);

  const handleCloseDeleteB = () => setShowDeleteB(false);
  const handleShowDeleteB = () =>  setShowDeleteB(true);

  const [showUpdateBoard, setShowUpdateBoard] = useState(false);

  const handleCloseUpdateBoard = () => setShowUpdateBoard(false);
  const handleShowUpdateBoard = () => (setShowUpdateBoard(true));

  const [showShare, setShowShare] = useState(false);

  const handleCloseShare = () => setShowShare(false);
  const handleShowShare = () => setShowShare(true);

  const [showLeave, setShowLeave] = useState(false);

  const handleCloseLeave = () => setShowLeave(false);
  const handleShowLeave = () => setShowLeave(true);

  const [loading, setLoading] = useState(true)
  const [leaveable, setLeavable] = useState(false)
  const { uuid } = useParams()
  const { name } = useParams()
  const [currentNote, setCurrentNote] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [currentBoard, setCurrentBoard] = useState()
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [titleUpdate, setTitleUpdate] = useState()
  const [descriptionUpdate, setDescriptionUpdate] = useState()
  const [nameUpdate, setNameUpdate] = useState()
  const [noteType, setNoteType] = useState("text")
  const [checkbox, setCheckbox] = useState([])
  const [checkboxtext, setCheckBoxText] = useState("")
  const [users, setUsers] = useState([{}])

  function addTextToCheckbox() {
    let obj = { Checked: false, Text: checkboxtext }
    setCheckbox([...checkbox, obj])
    setCheckBoxText("")
  }

  const handeUserChange = event => {
    console.log(event.target.value)
    setCurrentUser(event.target.value)
  }

  async function getUsers() {

    try {
      const q = query(
        collection(db, "users")
      );
      let arr = []
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.id = doc.id;
          arr.push(object)
        });
      });
      setUsers(arr)
    } catch (err) {
      console.error(err);
    }
  }

  async function getNotes() {
    try {
      const q = query(
        collection(db, "notes"),
        where("BoardID", "==", uuid)
      );
      let arr = []
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.id = doc.id;
          arr.push(object)

        });
      });
      setNotes(arr)
    } catch (err) {
      console.error(err);
    }
    setLoading(false)
  }

  async function createNote() {


    addDoc(collection(db, "notes"), {
      title: title,
      description: description,
      BoardID: uuid,
      Checkbox: checkbox
    })
      .catch((error) => {
        alert(error.message);
      });

    setCheckbox("")
    getNotes()
  }

  async function getBoards() {
    try {
      const q = query(
        collection(db, "boards"),
        where("BoardUUID", "==", uuid)
      );
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let object = doc.data();
          object.id = doc.id;
          setCurrentBoard(object)

        });
      });
    } catch (err) {
      console.error(err);
    }

  }

  async function deleteNote(note) {
    handleCloseDelete()
    console.log(note)
    deleteDoc(doc(db, "notes", note.id));

  }

  async function editNote() {
    console.log(currentNote)
    handleCloseUpdate()
    console.log(titleUpdate)
    console.log(descriptionUpdate)

    setDoc(doc(db, "notes", currentNote.id), {
      title: titleUpdate,
      description: descriptionUpdate,
      BoardID: currentNote.BoardID
    });

    getNotes()
  }

  async function editBoard() {

    updateDoc(doc(db, "boards", currentBoard.id), {
      Name: nameUpdate
    });

  }

  async function checkCheckbox(checkbox, note) {

    const ref = doc(db, "notes", note.id);
    await updateDoc(ref, {
      Checkbox: arrayRemove(checkbox)
    });

    checkbox.Checked = !checkbox.Checked

    // Atomically add a new region to the "regions" array field.
    await updateDoc(ref, {
      Checkbox: arrayUnion(checkbox)
    });

  }

  async function share() {

    const ref = doc(db, "boards", currentBoard.id);
    let obj = { uuid: currentUser.uid, role: "user" }
    await updateDoc(ref, {
      Users: arrayUnion(obj)
    });
  }

  async function leave() {
    const ref = doc(db, "boards", currentBoard.id);
    let obj = { uuid: user.uid, role: "user" }
    await updateDoc(ref, {
      Users: arrayRemove(obj)
    });
  }

  async function deleteBoard() {
    const ref = doc(db, "boards", currentBoard.id);
    await deleteDoc(ref)

  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleChange = (event) => {
    setNoteType(event.target.value)
  }

  useEffect(() => {
    getUsers()
    getNotes()
    getBoards()
  }, []);

  useEffect(() => {
    if(currentBoard !== undefined){
      for (let bu of currentBoard.Users) {
        if (user.uid === bu.uuid) {
          if(bu.role != "Owner"){
            setLeavable(true)
          }
        }
      }
    }
  }, [currentBoard, user]);


  if (loading) {
    return (
      <h1>Loading</h1>
    )
  }
  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Redirect link="../login" />
        <Grid>
          <h1 style={{ marginTop: "10%" }}>{name}</h1>
        </Grid>
        <Grid container direction="row" justifyContent="center" alignItems="center" >
          {notes.map((note, index) => (
            <Grid key={index} style={{ margin: "10px" }}>
              <Card variant="outlined" sx={{ maxWidth: 254 }} >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" >
                    <p>{note.title}</p>
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {note.description !== "undefined"
                      ? <>{note.description}</>
                      : <></>
                    }
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    {note.Checkbox !== []
                      ? <div>{note?.Checkbox?.map((item, key) => (
                        <div key={key}>{item.Checked === false
                          ? <div><input onClick={(e) => (checkCheckbox(item, note))} type="checkbox" defaultChecked={false} />{item.Text}</div>
                          : <div className='checked' ><input onClick={(e) => (checkCheckbox(item, note))} type="checkbox" defaultChecked={true} />{item.Text}</div>
                        }</div>
                      ))}</div>
                      : <></>
                    }
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="error" onClick={(e) => (handleShowDelete(note))}>löschen</Button>
                  <Button variant="contained" color="success" onClick={(e) => (handleShowUpdate(note))}>editieren</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center">
          <Button variant="contained" aria-label="add" style={{ margin: "10px" }} onClick={handleShow}>
            <AddIcon />
          </Button>
          <Button variant="contained" aria-label="add" style={{ margin: "10px" }} onClick={handleShowUpdateBoard}>
            <Edit />
          </Button>
          <Button variant="contained" aria-label="add" style={{ margin: "10px" }} onClick={handleShowShare}>
            <ShareIcon />
          </Button>
          {leaveable
          ?<Button variant="contained" color="error" aria-label="leabe" style={{ margin: "10px" }} onClick={handleShowLeave}>
            <LogoutIcon />
            </Button>
          :<Button variant="contained" color="error" aria-label="delete" style={{ margin: "10px" }} onClick={handleShowDeleteB}>
          <DeleteIcon />
          </Button>}

        </Grid>
        <Dialog onClose={handleClose} open={show}>
          <DialogContent>
            <Grid>
              <Grid>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="text" control={<Radio />} label="text" />
                    <FormControlLabel value="checklist" control={<Radio />} label="checklist" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid>
                <TextField placeholder="Title" type="text" style={{ margin: "10px" }} onChange={(e) => { setTitle(e.target.value) }} ></TextField>
              </Grid>
              <Grid>
                {noteType == "text"
                  ? <p><TextField placeholder="Description" style={{ margin: "10px" }} onChange={(e) => { setDescription(e.target.value) }}> </TextField> </p>
                  : <>
                    {checkbox?.map((text, index) => (
                      <>
                        <p>{text.Text}</p>
                      </>
                    ))}
                    <TextField type="text" style={{ margin: "10px" }} onClick={(e) => { setCheckBoxText(e.target.value) }} />
                    <Button onClick={addTextToCheckbox}>Add</Button>
                  </>
                }
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={createNote}>
              Create Note
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseUpdate} open={showUpdate}>
          <DialogContent>
            <TextField placeholder={currentNote?.title} style={{ margin: "10px" }} type="text" onChange={(e) => { setTitleUpdate(e.target.value) }} ></TextField>
            <br></br>
            <TextField placeholder={currentNote?.description} style={{ margin: "10px" }} onChange={(e) => { setDescriptionUpdate(e.target.value) }} ></TextField>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseUpdate}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={editNote}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseDelete} open={showDelete}>
          <DialogContent>
            Are you sure you want to delete note {currentNote?.title} ?
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseDelete}>
              Close
            </Button>
            <Button variant="contained" style={{ margin: "10px" }} onClick={(e) => (deleteNote(currentNote))}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseShare} open={showShare}>
          <DialogContent>
            <h4>Share this board</h4>
            <p>Select a user</p>

            <Select value={currentUser} onChange={handeUserChange} autoWidth label="Users">
              {users.map((item, key) => (
                <MenuItem key={key} value={item}>{item.email}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseShare}>
              Close
            </Button>

            <Button variant="contained" style={{ margin: "10px" }} onClick={share}>
              Share Board
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseLeave} open={showLeave}>
          <DialogContent>
            <h4>Leave this board</h4>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseLeave}>
              Close
            </Button>

            <Button variant="contained" style={{ margin: "10px" }} onClick={leave}>
              Leave Board
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseDeleteB} open={showDeleteB}>
          <DialogContent>
            <h4>Delete this board</h4>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseDeleteB}>
              Close
            </Button>

            <Button variant="contained" style={{ margin: "10px" }} onClick={deleteBoard}>
              Delete Board
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog onClose={handleCloseUpdateBoard} open={showUpdateBoard}>
          <DialogContent>
            <h4>Update this board</h4>

            <TextField placeholder={currentBoard?.Name} style={{ margin: "10px" }} type="text" onChange={(e) => { setNameUpdate(e.target.value) }} ></TextField>

          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ margin: "10px" }} onClick={handleCloseUpdateBoard}>
              Close
            </Button>

            <Button variant="contained" style={{ margin: "10px" }} onClick={editBoard}>
              Update Board
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  )

}