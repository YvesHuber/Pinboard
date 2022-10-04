var express = require('express')
var cors = require('cors')
var mysql = require('mysql');
const Cookies = require('js-cookie');
let app = express()
var handlebars = require('handlebars');
var fs = require('fs');
var nodemailer = require('nodemailer');
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
    var sql = "INSERT INTO user (firstname,lastname,email,address,password,PLZ,UUID) VALUES ('" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" + req.body.OrtIDFS + "', '" + req.body.uuid + "')";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
})
app.post('/updatepassword', async (req, res) => {
    console.log(req.body)
    var sql = "Update user Set Password='" + req.body.Password + "' Where UUID ='" + req.body.UUID + "'";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record Updated");
    });
})
app.post('/login', (req, res) => {
    const answer = con.query("SELECT * FROM user Where firstname ='" + req.body.firstname + "' && password='" + req.body.password + "';", (err, results) => {
        if (err) {
            return res.sendStatus(599)
        }
        try {
            if (results[0].UUID !== undefined) {
                console.log("Success at Login with " + req.body.firstname + " and " + req.body.password)
                console.log(results)
                return res.send(results[0].UUID)
            }
        }
        catch {
            console.log("no Login Succes with" + req.body.firstname + " and " + req.body.password)
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
app.delete('/deletenote', async (req, res) => {
    console.log('Got body:', req.body);
    let note = req.body
    const f = await con.query("DELETE FROM `pinboardnote` WHERE `NoteIDFS` = " + note.id, (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(results)
    })

    const answer = await con.query("DELETE FROM `note` WHERE `note`.`ID` = " + note.id, (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(results)
    })

})

app.put('/updatenote', async (req, res) => {
    console.log('Got body:', req.body);
    let note = req.body.data

    const answer = await con.query("UPDATE note SET title = '" + note.title + "', description= '" + note.description + "'WHERE ID =" + note.id, (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(results)
    })


})
app.delete('/deleteboard', async (req, res) => {
    console.log('Got body:', req.body);
    let board = req.body
    const f = await con.query("DELETE FROM `pinboardnote` WHERE `PinboardIDFS` = " + board.id, (err, results) => {
        if (err) {
            console.log(err)
        }
    })
    const u = await con.query("DELETE FROM `pinboarduser` WHERE `PinboardIDFS` = " + board.id, (err, results) => {
        if (err) {
            console.log(err)
        }
    })

    const answer = await con.query("DELETE FROM `pinboard` WHERE `ID` = " + board.id, (err, results) => {
        if (err) {
            console.log(err)
        }
    })

})


app.put('/updateboard', async (req, res) => {
    console.log('Got body:', req.body);
    let board = req.body.data

    const answer = await con.query("UPDATE pinboard SET name = '" + board.title + "' WHERE ID =" + board.id, (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(results)
    })


})
app.get('/getboards', async (req, res) => {
    let result = [];
    if (req.query.uuid !== undefined) {
        const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.query.uuid + "'", (err, results) => {
            if (err) {
                console.log(err)
            }
            let sql = "SELECT * FROM pinboard INNER JOIN pinboarduser ON pinboard.ID = pinboarduser.PinboardIDFS INNER JOIN user ON user.ID = pinboarduser.UserIDFS WHERE user.ID = '" + results[0].ID + "';"
            const boards = con.query(sql, (err, boardresult) => {
                if (err) {
                    console.log(err)
                }

                for (let i = 0; i < boardresult.length; i++) {
                    let object = {
                        id: boardresult[i].PinboardIDFS,
                        Name: boardresult[i].Name,
                        Createddate: boardresult[i].Createdon,
                        UUID: boardresult[i].uuid
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
    let checklist = [];
    console.log(req.query.UUID)
    if (req.query.UUID !== undefined) {

        const answers = await con.query("SELECT * FROM `checklist` ", (err, results) => {
            if (err) {
                console.log(err)
            }
            checklist = results;
        })

        const answer = await con.query("SELECT * FROM `note` INNER JOIN pinboardnote ON note.ID = pinboardnote.NoteIDFS INNER JOIN pinboard ON pinboardnote.pinboardIDFS = pinboard.ID WHERE pinboard.UUID = '" + req.query.UUID + "'", (err, results) => {
            if (err) {
                console.log(err)
            }

            for (let i = 0; i < results.length; i++) {
                let checkbox = []

                for(let j = 0; j < checklist.length; j++){
                    if(checklist[j].note_idfs == results[i].NoteIDFS){
                        let obj = {Id: checklist[j].Id, Text: checklist[j].Text, Checked: checklist[j].checked}
                        checkbox.push(obj)

                    }
                }
                
                let object = {
                    id: results[i].NoteIDFS,
                    title: results[i].title,
                    description: results[i].description,
                    checklist: checkbox
   
                }

                result.push(object)

            }

            return res.send(result)

        })
        

    } else {
        return res.send("no UUID")
    }
})
app.post('/createnote', async (req, res) => {
    console.log(req.body)
    let noteid

    let sql = "INSERT INTO Note (Title, Description) VALUES ('" + req.body.Title + "','" + req.body.Description + "');"
    const Note = con.query(sql, async function (err, result) {
        if (err) {
            throw err;
        }
        noteid = result.insertId;

        let pinnote = "INSERT INTO pinboardnote (PinboardIDFS, NoteIDFS) VALUES ('" + req.body.BoardID + "','" + noteid + "')";
        const pinboardnote = con.query(pinnote, async function (err, resu) {
            if (err) {
                throw err;
            }
        })
        req.body.Checkbox.forEach(value => {
            if (value !== "" && value !== undefined){
                console.log("INSERT INTO checklist (Text, note_idfs) VALUES ('" + value + "','" + noteid + "');")
                let checklist = "INSERT INTO checklist (Text, note_idfs) VALUES ('" + value + "', '" + noteid + "');";
                const checklistnote = con.query(checklist, async function (err, resu) {
                    if (err) {
                        throw err;
                    }
                })
            }

        });
    })
    console.log("inserted Note")
    return res.send(true)

})
app.get('/getuser', async (req, res) => {
    console.log(req.query.UUID)
    if (req.query.UUID !== undefined) {
        const answer = await con.query("SELECT * FROM `user` WHERE UUID = '" + req.query.UUID + "'", (err, results) => {
            if (err) {
                console.log(err)
            }
            return res.send(results)
        })
    } else {
        res.send("no UUID")
    }

})
app.post('/sendmail', async (req, res) => {
    console.log(req.body)
    let html = fs.readFileSync("./mail.html", "utf-8");
    let template = handlebars.compile(html);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'develop.yves.huber@gmail.com',
            pass: 'Yvesyves'
        }
    });
    var mailOptions = {
        from: 'develop.yves.huber@gmail.com',
        to: 'yves.huber05@gmail.com',
        subject: 'Sending Email using Node.js',
        text: template
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


})

app.put('/updatecheckbox', async (req, res) => {
    console.log('Got body:', req.body);
    let checklist = req.body

    if(req.body.Checked === "true"){
        const answer = await con.query("UPDATE checklist SET checked = 'false' WHERE ID =" + checklist.Id, (err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results)
        })
    }
    else {
        const answer = await con.query("UPDATE checklist SET checked = 'true' WHERE ID =" + checklist.Id, (err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results)
        })
    }
    return res.send("updated ")

    

    

})

async function getcheckboxes(){

}


app.listen(9000)