var express = require('express')
var cors = require('cors')
var mysql = require('mysql');
const Cookies = require('js-cookie');
let app=express()
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pinboard"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
app.get('/', (req, res) => {

    res.send("started")

});
app.post('/register', (req, res) => {
    console.log(req.body)
    var sql = "INSERT INTO user (firstname,lastname,email,address,password,OrtIDFS,UUID) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" +req.body.OrtIDFS+"', '"+ req.body.uuid +"')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
})
app.post('/login', (req, res) => {
    const answer = con.query("SELECT * FROM user ", (err, results)=> {
        if (err){
            return res.sendStatus(599)
        }
        for (let i = 0; i < results.length; i++) {
            if(req.body.firstname == results[i].firstname && req.body.password == results[i].password)
            {
                Cookies.set('Test', results[i].UUID, {expires: 1})
                return res.send(results[i].UUID)
            }
         }
          
         res.send('no cookie has been set')
         return
    })

});
app.post('/cookies', (req,res) => {

    const answer = con.query("SELECT * FROM `user` WHERE UUID = '"+req.body.UUID+"'", (err, results) => {
        if (err){
            return res.sendStatus(599)
        }
    })



})

app.listen(9000)