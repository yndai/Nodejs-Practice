/**
 * User registration
 */

var app = require('../app');

var user = require('../db_model/user');
var user_mgr = require('../db_mgr/userMgr');

app.get('/register', function(req, res, next){
	var data = {title : 'Register'};
	res.render('register', data);
});

app.post('/register', function(req, res, next){
	var usr = req.body.username;
	var pwd = req.body.password;
	
	var user_model = new user(usr, pwd, false);
	
	var data = {title:'Register'};
	var thisObj = this;
	
	user_mgr.addUser(user_model, function(err, id){
		if (err) {
			console.log('Error Adding User: ' + err);
			data.error = 'Error adding user! Please try again.';
			res.render('register', data);
		} else {
			console.log('Created user with id ' + id);
			data.success = "Successfully added user " + usr + "!";
			res.render('register', data);
		}
	});
	
});