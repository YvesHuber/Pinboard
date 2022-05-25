import '../style/App.css';
import '../style/Style.css';
import { useState } from "react";
const Cookies = require('js-cookie')
const axios = require('axios')

function Login() {
    const [firstname, setfirstname] = useState("")
    const [password, setpassword] = useState("");
    const [userid, setuserid] = useState("");

    async function makecall () {
        const res = await axios.post("http://localhost:9000/login", {firstname: firstname, password: password})
        .catch((error) => console.log(error));
        const testdata = await res.data;
        setuserid(testdata)
        Cookies.set('user', [testdata], {expires:1})


    }

        return (
            <>
            <div className="Login">
            <h2>Login</h2>
              <form>
                  <label>firstname</label>
                  <input type="text" onChange={(e) => {setfirstname(e.target.value)}}/> <br></br>
                  <label>password</label>
                  <input type="text" onChange={(e) => {setpassword(e.target.value)}}/> <br></br>
                  <input type="button" value="submit" onClick={(e)=> {makecall()}}/>
              </form>
              <p>{userid}</p>
              </div>
            </>
        );


}

export default Login;