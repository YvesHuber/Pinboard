var express = require('express')
var cors = require('cors')
var mysql = require('mysql');
const Cookies = require('js-cookie');
let app = express()
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
    var sql = "INSERT INTO user (firstname,lastname,email,address,password,OrtIDFS,UUID) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" + req.body.OrtIDFS + "', '" + req.body.uuid + "')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
})
app.post('/login', (req, res) => {
    const answer = con.query("SELECT * FROM user ", (err, results) => {
        if (err) {
            return res.sendStatus(599)
        }
        for (let i = 0; i < results.length; i++) {
            if (req.body.firstname === results[i].firstname && req.body.password === results[i].password) {
                console.log(answer)
                Cookies.set('Test', results[i].UUID, {
                    expires: 1
                })
                return res.send(results[i].UUID)
            }
        }
        res.send('no cookie has been set')
        return
    })

});
app.post('/cookies', async (req, res) => {
    if (req.body.UUID !== undefined) {
        const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.body.UUID + "'", (err, results) => {
            if (err) {
                return res.sendStatus(599)
            }
            return res.send(true)
        })
    } else {
        return res.send(false)
    }
});

app.post('/createboards', async (req, res) => {
    let date = new Date().toISOString().slice(0, 10).replace('T', ' ');
    console.log(req.body)
    const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.body.UUID + "'", (err, results) => {
        if (err) {
            return res.sendStatus(599)
        }
        let userid = results[0].ID
        let sql = "INSERT INTO pinboard (Name, Createdon,UUID) VALUES ('" + req.body.Name + "','" + date + "', '"+req.body.BoardUUID+"');" 
        console.log(sql)
        const ans = con.query(sql, async function (err, result) {
            if (err) { 
            throw err;
            }
            console.log(result)
            let usersql = "INSERT INTO pinboarduser (UserIDFS, PinboardIDFS, role) VALUES ('" + userid + "','" + result.insertId + "','1')"; 
            console.log(usersql)
            const answer = con.query (usersql, async function (err, result) {
                if (err) { 
                    throw err;
                    } 
            })
            return res.send(true)
        })
    })
})
app.get('/getboards', async (req, res) => {
    let result = [];
    if (req.query.UUID !== undefined) {
        const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.query.UUID + "'", (err, results) => {
            if (err) {
                console.log(err)
            }
            let sql = "SELECT pinboard.ID, pinboard.Name, pinboard.Createdon, pinboard.UUID FROM pinboard INNER JOIN pinboarduser ON pinboard.ID = pinboarduser.PinboardIDFS INNER JOIN user ON user.ID = pinboarduser.UserIDFS WHERE user.ID = '"+ results[0].ID +"';"
            const boards = con.query(sql, (err, boardresult) => {
                if (err) {
                    console.log(err)
                }
                for (let i = 0; i < boardresult.length; i++){
                    let object = {Name: boardresult[i].Name, Createddate: boardresult[i].Createdon, UUID: boardresult[i].UUID}
                    result.push(object)
                }
                res.send(result)
            })   
        })   
    } else {
       res.send("no UUID")
    }

})



app.listen(9000)