var express = require('express')
var cors = require('cors')
var mysql = require('mysql');
const cookie_parser = require('cookie-parser')
let app=express()
app.use(cookie_parser())
app.use(cors());
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
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
/*
app.post('/login', (req, res) => {
   const answer = con.query("SELECT * FROM user ", (err, results)=> {
       if (err){
           return res.sendStatus(599)
       }
       for (let i = 0; i < results.length; i++) {
           if(req.body.firstname == results[i].firstname && req.body.password == results[i].password)
           {
            console.log(req.cookies)
            res.cookie('pinboard',results[i].uuid, {maxAge: 90000})
            return res.send('Cookie has been set')
    
           }
        }
   })
   res.status(200)
})
*/
app.get('/login', (req, res) => {
    const answer = con.query("SELECT * FROM user ", (err, results)=> {
        if (err){
            return res.sendStatus(599)
        }
        for (let i = 0; i < results.length; i++) {
            if(req.query.firstname == results[i].firstname && req.query.password == results[i].password)
            {
                res.cookie('pinboard',results[i].UUID, {maxAge: 90000})
                return res.send("cookie baked")
            }
         }
          
         res.send('no cookie has been set')
         return
    })

});

app.listen(9000)