import logo from './logo.svg';
import './App.css';
import Register from './register'
import Login from './login'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
  <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
