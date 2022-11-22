const express = require("express");
const app = express();
const port = 3004;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const md5 = require('js-md5');
const uuid = require('uuid');
const mysql = require("mysql");
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "be1",
});

////////////////////LOGIN/////////////////

const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/server')) { // admin
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login') || 0 === req.url.indexOf('/register')) {
        next();
    } else { // fron
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}

app.use(doAuth);

////////////////////AUTH////////////////////

app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role, id
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); // user not logged
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2, user_id: result[0].id   }); // not an admin
                } else {
                    res.send({ msg: 'ok', status: 3, user_id: result[0].id   }); // is admin
                }
            } else {
                res.send({ msg: 'ok', status: 4, user_id: result[0].id }); // is user
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
            res.status(401).send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Good to see you ' + req.body.user + ' again.', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
    const key = uuid.v4();
    const sql = `
    INSERT INTO users (name, psw, session)
    VALUES (?, ?, ?)
  `;
    con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
        if (err) throw err;
    });
});


////////////////////CREATE////////////////////

    app.post("/server/ideas", (req, res) => {
        const sql = `
        INSERT INTO ideas (title, idea, goal, image)
        VALUES (?, ?, ?, ?, ?)
        `;
        con.query(sql, [req.body.title, req.body.idea, req.body.goal, req.body.image], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'New idea was added.', type: 'success' });
        });
    });

    app.post("/ideas", (req, res) => {

        const sql = `
        INSERT INTO ideas (title, idea, goal, remaining, image, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
       
        con.query(sql, [req.body.title, req.body.idea, req.body.goal, req.body.goal, req.body.image, req.body.user_id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'New idea was added.', type: 'success' });
        });
    });


    app.post("/givers", (req, res) => {
        const sql = `
        INSERT INTO givers (name, sum, idea_id)
        VALUES (?, ?, ?)
        `;
        con.query(sql, [req.body.name, req.body.sum, req.body.idea_id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'Contribution was added.', type: 'success' });
        });
    });

    app.post("/home/comments/:id", (req, res) => {
        const sql = `
        INSERT INTO comments (post, idea_id)
        VALUES (?, ?)
        `;
        con.query(sql, [req.body.post, req.params.id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'Thanks, for commenting.', type: 'info' });
        });
    });

//////////////////// READ (all) ////////////////////

app.get("/server/ideas", (req, res) => {
    const sql = `
    SELECT *
    FROM ideas
    ORDER BY raised ASC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/ideas/:id", (req, res) => {
    const sql = `
    SELECT i.*
    FROM ideas AS i
    INNER JOIN users AS u
    ON i.user_id = u.id 
    WHERE i.user_id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/home/ideas", (req, res) => {
    const sql = `
    SELECT i.*, g.id as gid, g.sum, g.name, g.idea_id FROM ideas AS i LEFT JOIN givers AS g ON g.idea_id = i.id  WHERE i.state = 1 ORDER BY i.title
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/home/comments/:id", (req, res) => {
    const sql = `
    SELECT c.* FROM comments AS c WHERE c.idea_id = ?
    `;
    con.query(sql,  [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/server/ideas/wc", (req, res) => {
    const sql = `
    SELECT i.*, c.id AS cid, c.post
    FROM ideas AS i
    INNER JOIN comments AS c
    ON c.idea_id = i.id
    ORDER BY i.title
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});



//////////////////// DELETE ////////////////////

app.delete("/server/ideas/:id", (req, res) => {
    const sql = `
    DELETE FROM ideas
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Idea was deleted.', type: 'info' });

    });
});

app.delete("/ideas/:id", (req, res) => {
    const sql = `
    DELETE FROM ideas
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Idea was deleted.', type: 'info' });

    });
});

app.delete("/server/comments/:id", (req, res) => {
    const sql = `
    DELETE FROM comments
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Comment was deleted.', type: 'info' });
    });
});





//////////////////// EDIT ////////////////////
app.put("/home/ideas/:id", (req, res) => {
    const sql = `
    UPDATE ideas
    SET 
    raised = raised + ?, 
    WHERE sum = ?
    `;
    con.query(sql, [req.body.raised, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thanks for your donation.', type: 'info' });

    });
});
//kai giveris paaukoja
app.put("/ideas/:id", (req, res) => {
    const sql = `
    UPDATE ideas
    SET 
    raised = raised + ?, remaining = goal - raised
    WHERE id = ?
    `;
    con.query(sql, [req.body.raised, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thanks for your donation.', type: 'info' });

    });
});

app.put("/server/ideas/:id", (req, res) => {
    let sql;
    let r;
    if (req.body.deletePhoto) {
        sql = `
        UPDATE ideas
        SET title = ?, idea = ?, goal = ?, image = null
        WHERE id = ?
        `;
        r = [req.body.title, req.body.idea, req.body.goal, req.params.id];
    } else if (req.body.image) {
        sql = `
        UPDATE ideas
        SET title = ?, idea = ?, goal = ?, image = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.idea, req.body.goal, req.body.image, req.params.id];
    } 
    else if(req.body.confirmed === 0 || req.body.confirmed === 1){
        sql = `
        UPDATE ideas
        SET state = ?
        WHERE id = ?
        `;
        r = [req.body.confirmed, req.params.id];
    }
    
    else {
        sql = `
        UPDATE ideas
        SET title = ?, idea = ?, goal = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.idea, req.body.goal, req.params.id]
    }
    con.query(sql, r, (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The Idea was edited.', type: 'success' });

    });
});

app.listen(port, () => {
    console.log(`PORT ${port} IS LIVE`)
});


