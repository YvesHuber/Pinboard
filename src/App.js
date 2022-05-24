import logo from './logo.svg';
import './App.css';
import Register from './register'
import Login from './login'
import Mainpage from './mainpage'
import Navigation from './navbar'
import Board from './board'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {

  return (
  <div>
    <Navigation/>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Board/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
