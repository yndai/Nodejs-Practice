/*
 * Image Gallery
 */

var app = require('../app');
var fs = require('fs');

app.get('/gallery', function(req, res, next){
	var data = {title : 'Image Gallery'};
	res.render('gallery', data);

});

app.post('/gallery-upload', function(req, res, next){
	
	if (req.files.image && req.files.image.type.match(/image\/\s*/)){
		console.log("ok1");
		var tmpPath = req.files.image.path;
		
		var targetName = getTimestamp() + "-" + req.files.image.name;
		
		var targetPath = 'public/images/' + targetName;
		
		fs.rename(tmpPath, targetPath, function(err){
			if (err) throw err;
			
			if (fs.existsSync(tmpPath)){
				fs.unlink(tmpPath, function(err){
					if (err) throw err;
				});
			}
			var data = {title : 'Image Gallery',
						msg : 'File uploaded'};
			res.render('gallery', data);
		});
		
		
	} else {
		var data = {title : 'Image Gallery',
					msg : 'File missing or incorrect type'};
		res.render('gallery', data);
	}
	
});

function getTimestamp(){
	
	var date = new Date();
	
	var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
	
	return year+month+day+hour+min+sec;
}
