var express = require('express')
var app = express()
var cors = require('cors')
var mysql = require('mysql');
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
app.get('/user', (req, res) => {
    const answer = con.query("SELECT * FROM user", (err, results) => {
        if (err) {
            return res.sendStatus(500)
        }
        res.send(results)
    })
});

app.post('/register', (req, res) => {
    console.log(req.body)
    var sql = "INSERT INTO user (firstname,lastname,email,address,password,OrtIDFS) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" +req.body.OrtIDFS+"')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
})
app.get('/login', (req, res) => {
   const answer = con.query("SELECT * FROM user ", (err, results)=> {
       if (err){
           return res.sendStatus(599)
       }
       res.send(results)
   })
})

app.listen(9000)