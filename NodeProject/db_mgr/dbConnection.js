var mysql = require('mysql');

var db_connect = {
	host : '127.0.0.1',
	port : '3306',
	database : 'db',
	user : 'db',
	password : 'db'
};

module.exports = mysql.createPool(db_connect);