import logo from './logo.svg';
import './App.css';
import Register from './register'
import Login from './login'
import Mainpage from './mainpage'
import Navigation from './navbar'
import Board from './board'
import Cookie from './cookiecheck';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
  <div className="App">
    <Navigation/>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Mainpage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/board" element={<Board/>}/>
        <Route path="/dev" element={<Cookie/>}/>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
