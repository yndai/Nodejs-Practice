
/*
 * Home Page
 */

var app = require('../app');

var user = require('../db_model/user');
var user_mgr = require('../db_mgr/userMgr');

app.get('/', function(req, res, next){
	var data = {title : 'My App'};
	res.render('index', data);

});

app.post('/', function(req, res, next){
	var usr = req.body.username;
	var pwd = req.body.password;
	
	var user_model = new user(usr, pwd, false);
	user_mgr.addOrUpdate(user_model, function(err, id){
		if (err) {
			console.log('Error Adding User: ' + err);
		} else {
			console.log('Created user with id ' + id);
		}
	});
	
	var data = {title : 'My App',
				username : usr,
				password : pwd};

	res.render('index', data);

});