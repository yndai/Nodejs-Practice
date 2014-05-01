/**
 * User creation/authentication
 */

var app = require('../app');

var user = require('../db_model/user');
var user_mgr = require('../db_mgr/userMgr');

app.get('/register', function(req, res, next){
	var data = {title : 'Register',
				req : req};
	res.render('register', data);
});

app.post('/register', function(req, res, next){
	var usr = req.body.username;
	var pwd = req.body.password;
	
	var user_model = new user(usr, pwd, false);
	
	var data = {title:'Register',
				req : req};
	
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

app.get('/login', function(req, res, next){
	var data = {title : 'Login',
				req : req};
	res.render('login', data);
});
app.get('/logout', function(req, res, next){
	delete req.session.user;
	var data = {title : 'Logout',
				req : req,
				success : 'Successfully logged out!'};
	res.render('login', data);
});

app.post('/login', function(req, res, next){
	var usr = req.body.username;
	var pwd = req.body.password;
	
	var data = {title:'Login',
				req : req};
	
	user_mgr.getUser(usr, pwd, function(err, row){
		if (err) {
			console.log('Error Finding User: ' + err);
			data.error = 'Incorrect login. Please try again.';
			res.render('login', data);
		} else {
			console.log('Found user ' + row.name);
			data.success = 'Successfully logged in!';
			req.session.user = row.name;
			res.render('login', data);
		}
	});
	
});