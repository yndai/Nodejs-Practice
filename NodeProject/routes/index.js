
/*
 * Home Page
 */

var app = require('../app');

//require each route js file
require('fs').readdirSync(__dirname + '/').forEach(function(file){
	if (file.match(/.+\.js/) !== null && file !== 'index.js'){
		require('./' + file);
	}
});

app.get('/index', function(req, res, next){
	var data = {title : 'Image Gallery',
				req : req};
	res.render('index', data);

});

