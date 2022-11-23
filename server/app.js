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
    database: "egz",
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

    app.post("/server/books/", (req, res) => {
        const sql = `
        INSERT INTO books (title, description, category, reserved, image)
        VALUES (?, ?, ?, ?, ?)
        `;
        con.query(sql, [req.body.title, req.body.description, req.body.category, req.body.reserved, req.body.image], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'New book was added.', type: 'success' });
        });
    });

    app.post("/books/", (req, res) => {

        const sql = `
        INSERT INTO books (title, description, category, reserved, image, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
       
        con.query(sql, [req.body.title, req.body.description, req.body.category, req.body.reserved, req.body.image, req.body.user_id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'New Book was added.', type: 'success' });
        });
    });


    app.post("/readers", (req, res) => {
        const sql = `
        INSERT INTO givers (name, reserved, book_id)
        VALUES (?, ?, ?)
        `;
        con.query(sql, [req.body.name, req.body.reserved, req.body.book_id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'Reservation was added.', type: 'success' });
        });
    });

    app.post("/home/comments/:id", (req, res) => {
        const sql = `
        INSERT INTO comments (post, book_id)
        VALUES (?, ?)
        `;
        con.query(sql, [req.body.post, req.params.id], (err, result) => {
            if (err) throw err;
            res.send({ msg: 'OK', text: 'Thanks, for commenting.', type: 'info' });
        });
    });

//////////////////// READ (all) ////////////////////

app.get("/server/books", (req, res) => {
    const sql = `
    SELECT *
    FROM books
    ORDER BY title ASC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/books/:id", (req, res) => {
    const sql = `
    SELECT b.*
    FROM books AS b
    INNER JOIN users AS u
    ON b.user_id = u.id 
    WHERE b.user_id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/home/books", (req, res) => {
    const sql = `
    SELECT b.*, r.id as rid, r.reserved, r.name, r.book_id FROM books AS b LEFT JOIN readers AS r ON r.book_id = b.id  WHERE b.reserved = 0 ORDER BY b.title
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/home/comments/:id", (req, res) => {
    const sql = `
    SELECT c.* FROM comments AS c WHERE c.book_id = ?
    `;
    con.query(sql,  [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get("/server/books/wc", (req, res) => {
    const sql = `
    SELECT b.*, c.id AS cid, c.post
    FROM books AS b
    INNER JOIN comments AS c
    ON c.book_id = b.id
    ORDER BY b.title
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});



//////////////////// DELETE ////////////////////

app.delete("/server/books/:id", (req, res) => {
    const sql = `
    DELETE FROM books
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Book was deleted.', type: 'info' });

    });
});

app.delete("/books/:id", (req, res) => {
    const sql = `
    DELETE FROM books
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Book was deleted.', type: 'info' });

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
app.put("/home/books/:id", (req, res) => {
    const sql = `
    UPDATE books
    SET 
    reserved =  ?, 
    WHERE user_id = ?
    `;
    con.query(sql, [req.body.reserved, req.body.user_id, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thanks for your Reservation', type: 'info' });

    });
});
app.put("/books/:id", (req, res) => {
    const sql = `
    UPDATE books
    SET 
    reserved = ?
    WHERE id = ?
    `;
    con.query(sql, [req.body.reserved, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thanks for your Reservation', type: 'info' });

    });
});

app.put("/server/books/:id", (req, res) => {
    let sql;
    let r;
    if (req.body.deletePhoto) {
        sql = `
        UPDATE books
        SET title = ?, description = ?, category = ?, reserved = ?, image = null
        WHERE id = ?
        `;
        r = [req.body.title, req.body.description, req.body.category, req.body.reserved, req.params.id];
    } else if (req.body.image) {
        sql = `
        UPDATE books
        SET title = ?, description = ?, category = ?, reserved = ?, image = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.description, req.body.category, req.body.reserved, req.body.image, req.params.id];
    } 
    else if(req.body.confirmed === 0 || req.body.confirmed === 1){
        sql = `
        UPDATE books
        SET reserved = ?
        WHERE id = ?
        `;
        r = [req.body.confirmed, req.params.id];
    }
    
    else {
        sql = `
        UPDATE books
        SET title = ?, description = ?, category = ?, reserved = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.description, req.body.category, req.body.reserved, req.params.id]
    }
    con.query(sql, r, (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The Book was edited.', type: 'success' });

    });
});

app.listen(port, () => {
    console.log(`PORT ${port} IS LIVE`)
});


