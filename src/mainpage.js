import './App.css';
import { useState, useEffect } from "react";
import Redirect from './redirect';

const Cookies = require('js-cookie')
const axios = require('axios')

export default function Mainpage() {

  useEffect(() => {
    
  }, );


  return (
    <>
        <Redirect link="../login"/>
        <h1>
            Mainpage
        </h1>
        <h2>
          This is a page
        </h2>

      </>
  );
 

}
