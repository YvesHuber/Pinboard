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
    var sql = "INSERT INTO user (firstname,lastname,email,address,password,PLZ,UUID) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" + req.body.OrtIDFS + "', '" + req.body.uuid + "')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
})
app.post('/login', (req, res) => {
    const answer = con.query("SELECT * FROM user Where firstname ='"+req.body.firstname+"' && password='"+req.body.password+"';", (err, results) => {
        if (err) {
            return res.sendStatus(599)
        }
        try {
        if (results[0].UUID !== undefined){
            console.log("Success at Login with "+ req.body.firstname + " and " + req.body.password)
            console.log(results)
            return res.send(results[0].UUID)
        }
        }
        catch{
            console.log("no Login Succes with" + req.body.firstname + " and " + req.body.password )
            return res.send("ERR")
        }
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
        let sql = "INSERT INTO pinboard (Name, Createdon,UUID) VALUES ('" + req.body.Name + "','" + date + "', '" + req.body.BoardUUID + "');"
        console.log(sql)
        const ans = con.query(sql, async function (err, result) {
            if (err) {
                throw err;
            }
            console.log(result)
            let usersql = "INSERT INTO pinboarduser (UserIDFS, PinboardIDFS, role) VALUES ('" + userid + "','" + result.insertId + "','1')";
            console.log(usersql)
            const answer = con.query(usersql, async function (err, result) {
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
            let sql = "SELECT pinboard.ID, pinboard.Name, pinboard.Createdon, pinboard.UUID FROM pinboard INNER JOIN pinboarduser ON pinboard.ID = pinboarduser.PinboardIDFS INNER JOIN user ON user.ID = pinboarduser.UserIDFS WHERE user.ID = '" + results[0].ID + "';"
            const boards = con.query(sql, (err, boardresult) => {
                if (err) {
                    console.log(err)
                }
                for (let i = 0; i < boardresult.length; i++) {
                    let object = {
                        Name: boardresult[i].Name,
                        Createddate: boardresult[i].Createdon,
                        UUID: boardresult[i].UUID
                    }
                    result.push(object)
                }
                res.send(result)
            })
        })
    } else {
        res.send("no UUID")
    }

})
app.get('/getnotes', async (req, res) => {
    let result = [];
    console.log(req.query.UUID)
    if (req.query.UUID !== undefined) {
        const answer = await con.query("SELECT note.title, note.description FROM `note` INNER JOIN pinboardnote ON note.ID = pinboardnote.NoteIDFS INNER JOIN pinboard ON pinboardnote.pinboardIDFS = pinboard.ID WHERE pinboard.UUID = '" + req.query.UUID + "'", (err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results)
            for (let i = 0; i < results.length; i++) {
                let object = {
                    title: results[i].title,
                    description: results[i].description
                }
                result.push(object)
            }


            console.log(result)
            return res.send(result)

        })

    } else {
        return res.send("no UUID")
    }
})
app.post('/createnote', async (req, res) => {
    console.log(req.body)
    let noteid
    let pinboardid
    let sql = "INSERT INTO Note (Title, Description) VALUES ('" + req.body.Title + "','" + req.body.Description + "');"
    const Note = con.query(sql, async function (err, result) {
        if (err) {
            throw err;
        }
        noteid = result.insertId;
        const pinboardselect = await con.query("SELECT * FROM `pinboard` WHERE UUID = '" + req.body.BoardUUID + "'", (err, results) => {
            if (err) {
                return res.sendStatus(599)
            }
            pinboardid = results[0].ID
            let pinnote = "INSERT INTO pinboardnote (PinboardIDFS, NoteIDFS) VALUES ('" + pinboardid + "','" + noteid + "')";
            const pinboardnote = con.query(pinnote, async function (err, resu) {
                if (err) {
                    throw err;
                }
            })
        })
        console.log("inserted Note")
        return res.send(true)
    })

})
app.get('/getuser', async (req, res) => {
    console.log(req.query.UUID)
    if (req.query.UUID !== undefined) {
        const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.query.UUID + "'", (err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results)
            return res.send(results)
        })
    } else {
        res.send("no UUID")
    }

})


app.listen(9000)