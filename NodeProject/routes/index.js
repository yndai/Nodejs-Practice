
/*
 * Home Page
 */

var app = require('../app');

app.get('/index', function(req, res, next){
	var data = {title : 'My App'};
	res.render('index', data);

});

// require each route  js file
require('fs').readdirSync(__dirname + '/').forEach(function(file){
	if (file.match(/.+\.js/) !== null && file !== 'index.js'){
		require('./' + file);
	}
});