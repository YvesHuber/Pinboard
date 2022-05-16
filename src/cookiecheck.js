import './App.css';
import { useState, useEffect } from "react";
import {checkCookie} from "./cookie";


export default function Cookie() {

  const [valid, validation] = useState(false)


  useEffect(() => {
    checkCookie()
    .then((response) => validation(response))
    .catch((err) => console.error(err));

    console.log(valid)
    
  }, [] );

  return (
    <>
    <p>Loading</p>
    <p>{valid}</p>
    </>
  )
}
