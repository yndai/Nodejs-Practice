
var pool = require('./dbConnection');
var mysql = require('mysql');

// SQL queries
var USER_INSERT_QUERY = 'INSERT INTO Users (name,password,admin) VALUES (?, SHA1(?), ?)';
var USER_FIND_QUERY = 'SELECT name FROM Users where name = ? and password = SHA(?)';
var USER_GET_ID_QUERY = 'SELECT id FROM Users where name = ?';
var USER_GET_NAME_QUERY = 'SELECT name FROM Users where id = ?';

//TODO: add update functionality?
function addUser(usr, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
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
		//console.log(q.sql);
	});
}

function getUser(name, pwd, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
		var queryAttrs = [name, pwd];
		var q = cxn.query(USER_FIND_QUERY, queryAttrs, function(err, rows) {
			if (err) {
				console.log('DB Error: ' + err);
				callback(err);
			} else if (rows.length != 1) {
				console.log('Error: user not found');
				callback('User not found');
			} else {
				console.log('Select complete');
				callback(err, rows[0]);
			}
			cxn.release();
		});
		//console.log(q.sql);
	});
}

function getIdByName(name, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
		var queryAttrs = [name];
		var q = cxn.query(USER_GET_ID_QUERY, queryAttrs, function(err, rows) {
			if (err) {
				console.log('DB Error: ' + err);
				callback && callback(err);
			} else if (rows.length != 1) {
				console.log('Error: user not found');
				callback &&  callback('User not found');
			} else {
				console.log('Select complete');
				callback && callback(err, rows[0].id);
			}
			cxn.release();
		});
		console.log(q.sql);
	});
}

function getNameById(id, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
		var queryAttrs = [id];
		var q = cxn.query(USER_GET_NAME_QUERY, queryAttrs, function(err, rows) {
			if (err) {
				console.log('DB Error: ' + err);
				callback && callback(err);
			} else if (rows.length != 1) {
				console.log('Error: user not found');
				callback &&  callback('User not found');
			} else {
				console.log('Select complete');
				callback && callback(err, rows[0].name);
			}
			cxn.release();
		});
		console.log(q.sql);
	});
}

var user_mgr = {
	addUser : addUser,
	getUser : getUser,
	getIdByName : getIdByName,
	getNameById : getNameById
};

module.exports = user_mgr;
