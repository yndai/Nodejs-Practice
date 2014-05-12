
var pool = require('./dbConnection');
var mysql = require('mysql');

// SQL queries
var IMAGE_INSERT_QUERY = 'INSERT INTO Images (name,user,source,date,description) VALUES (?, ?, ?, ?, ?)';
var IMAGE_LIST_QUERY = 'SELECT * FROM Images ORDER BY name ASC LIMIT 0,18446744073709551615';
var IMAGE_USER_LIST_QUERY = 'SELECT i.name, i.source, i.date, i.description, u.name as user FROM Images i LEFT JOIN Users u ON i.user = u.id;'

//TODO: add update functionality?
function addImage(image, callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
		var queryAttrs = [image.name, image.user, image.source, image.date, image.description];
		var q = cxn.query(IMAGE_INSERT_QUERY, queryAttrs, function(err, result) {
			if (err) {
				console.log('DB Error: ' + err);
				callback(err);
			} else {
				console.log('Image ' + image.name + ' persisted');
				callback(err, result.insertId);
			}
			cxn.release();
		});
		//console.log(q.sql);
	});
}

//TODO: add options for asc/desc and start/end for paging/filtering
function listImages(callback){
	
	pool.getConnection( function(err, cxn){
		if (err) console.log ('Get Connection Error: ' + err);
	
		var queryAttrs = [];
		var q = cxn.query(IMAGE_USER_LIST_QUERY, queryAttrs, function(err, rows) {
			if (err) {
				console.log('DB Error: ' + err);
				callback(err);
			} else {
				console.log('Select complete');
				callback(err, rows);
			}
			cxn.release();
		});
		//console.log(q.sql);
	});
	
}

var img_mgr = {
	addImage : addImage,
	listImages : listImages
};

module.exports = img_mgr;