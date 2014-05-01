
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser({
	uploadDir:'public/tmp/uploads',
	keepExtensions:true
}));
app.use(express.cookieParser());
app.use(express.session({secret : 'winter_is_coming'}));
app.use(express.limit('5mb'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env'))
  app.use(express.errorHandler());

if (!fs.existsSync('public/images'))
	fs.mkdirSync('public/images', 0766);
if (!fs.existsSync('public/tmp/uploads/'))
	mkdirRec('public/tmp/uploads/', 0766);

require("./routes");

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function mkdirRec(dir, mode){
	try {
		fs.mkdirSync(dir, mode);
	} catch (e) {
		if (e && e.errno === 34){
			mkdirRec(path.dirname(dir), mode);
			fs.mkdirSync(dir, mode);
		} else {
			throw (e);
		}
	}
}