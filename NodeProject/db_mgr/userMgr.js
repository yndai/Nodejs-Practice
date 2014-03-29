
var pool = require('./dbConnection');
var mysql = require('mysql');

var USER_INSERT_QUERY = 'INSERT INTO Users (name,password,admin) VALUES (?, SHA1(?), ?)';
var USER_FIND_QUERY = 'SELECT';

//TODO: add update functionality?
function addUser(usr, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) {
			console.log ('Get Connection Error: ' + err);
		}
	
		var queryAttrs = [usr.name, usr.password, usr.admin.toString()];
		var q = cxn.query(USER_INSERT_QUERY, queryAttrs, function(err, result) {
			if (err) {
				console.log('DB Error: ' + err);
				callback(err);
			} else {
				console.log('User ' + usr.name + ' persisted');
				callback(err, result.insertId);
			}
			cxn.release();
		});
		console.log(q.sql);
	});
}

function getUser(name, pwd){
	
}

function verifyUser(name, pwd){
	
}

var user_mgr = {
	addUser : addUser
		
		
};

module.exports = user_mgr;