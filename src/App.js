import logo from './logo.svg';
import './style/App.css';
import Register from './components/register'
import Login from './components/login'
import Mainpage from './components/mainpage'
import Navigation from './components/navbar'
import Crypto from './components/crypto'
import Board from './components/board'
import User from './components/user'
import Boarddisplay from './components/boarddisplay'
import Invite from './components/invite';


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
  <div>
    <Navigation/>
    <BrowserRouter>
      <Routes>
        <Route exact path="" element={<Board/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/dev" element={<Crypto/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/board/:name/:uuid" element={<Boarddisplay/>}/>
        <Route exact path="/user" element={<User/>}/>
        <Route exact path="/invite/:id" element={<Invite/>}/>

      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
