const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

const port = process.env.PORT || 3500; //Set the port to listen to

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//MySQL 
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', //edit passwords when going to production
    user: 'root',
    password: null,
    database: 'vintage_voyage'
});

//Get all Antiques
app.get('/api/antiques', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM antique_table', (err, rows) => {
            connection.release(); //return the connection to pool
            if(!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//Get one Antique
app.get('/api/antiques/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM antique_table WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); //return the connection to pool
            if(!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//Create an Antique
app.post('/api/antiques', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO antique_table SET ?', params, (err, rows) => {
            connection.release(); //return the connection to pool
            if(!err) {
                res.send(`Antique with the Record ID: ${req.body.id} has been added.`);
            } else {
                console.log(err);
            }
        });
    });
});

//Update an Antique
app.put('/api/update/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        const { id, name, description, origin, century, price, category } = req.body;
        connection.query('UPDATE antique_table SET name = ?, description = ?, origin = ?, century = ?, price = ?, category = ? WHERE id = ?', [name,description,origin,century,price,category,id], (err, rows) => {
            connection.release(); //return the connection to pool
            if(!err) {
                res.send(`Antique with the Record ID: ${id} has been updated.`);
            } else {
                console.log(err);
            }
        });
    });
});

//Delete an Antique
app.delete('/api/delete/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE FROM antique_table WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release(); //return the connection to pool
            if(!err) {
                res.send(`Antique with the Record ID: ${req.params.id} has been removed.`);
            } else {
                console.log(err);
            }
        });
    });
});

// //Search by string in name
// app.get("/api/antiques/byname/:name", (req, res) => {
//     let name = req.params.name;
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         connection.query(
//             `SELECT * FROM antique_table WHERE name LIKE '%${name}%'`,
//             (err, rows) => {
//               if (!err) {
//                 res.json(rows);
//               } else {
//                 console.log(err);
//               }
//             }
//           );
//         });
//   });

// //Search by category 
// app.get("/api/antiques/bycategory/:category", (req, res) => {
//     let category = req.params.category;
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         connection.query(
//             `SELECT * FROM antique_table WHERE category = '${category}'`,
//             (err, rows) => {
//               if (!err) {
//                 res.json(rows);
//               } else {
//                 console.log(err);
//               }
//             }
//           );
//         });
//   });

// //Search by price range
// app.get("/api/antiques/byrange/:min/:max", (req, res) => {
//     let min = req.params.min;
//     let max = req.params.max;
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         connection.query(
//             `SELECT * FROM antique_table WHERE price BETWEEN ${min} AND ${max} ORDER BY price`,
//             (err, rows) => {
//               if (!err) {
//                 res.json(rows);
//               } else {
//                 console.log(err);
//               }
//             }
//           );
//         });
// });

// //Search by century
// app.get("/api/antiques/bycentury/:century", (req, res) => {
//     let century = req.params.century;
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         connection.query(
//             `SELECT * FROM antique_table WHERE century = '${century}'`,
//             (err, rows) => {
//               if (!err) {
//                 res.json(rows);
//               } else {
//                 console.log(err);
//               }
//             }
//           );
//         });
//   });


// //Search by origin
// app.get("/api/antiques/byorigin/:origin", (req, res) => {
//     let origin = req.params.origin;
//     pool.getConnection((err, connection) => {
//         if(err) throw err;
//         connection.query(
//             `SELECT * FROM antique_table WHERE origin = '${origin}'`,
//             (err, rows) => {
//               if (!err) {
//                 res.json(rows);
//               } else {
//                 console.log(err);
//               }
//             }
//           );
//         });
//   });

//Listening on port 3500
app.listen(port, () => console.log(`Listening on port ${port}`));


