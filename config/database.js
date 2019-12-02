var mysql = require('mysql2'); 

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gimenes1",
    database: "trabalhoBanco"
});


module.exports = con;
