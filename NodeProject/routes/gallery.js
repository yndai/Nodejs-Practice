/*
 * Image Gallery
 */

var app = require('../app');
var fs = require('fs');

var user = require('../db_model/user');
var image = require('../db_model/image');
var user_mgr = require('../db_mgr/userMgr');
var image_mgr = require('../db_mgr/imageMgr');

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
function getDate(){
	
	var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
	return year + '-' + month + '-' + day;
}

function listImages(){
	var arr = [];
	fs.readdirSync("public/images").forEach( function(file){
		arr.push("/images/" + file);
	});
	return arr;
}

app.get('/gallery', function(req, res, next){
	var data = {title : 'Image Gallery',
				req : req,
				imageList : listImages()};
	res.render('gallery', data);

});

app.post('/gallery', function(req, res, next){
	
	if (req.files.image && req.files.image.type.match(/image\/\s*/)){
		var tmpPath = req.files.image.path;
		var targetName = getTimestamp() + "-" + req.files.image.name;
		var targetPath = 'public/images/' + targetName;
		var title = req.body.title;
		var desc = req.body.des;
		
		fs.rename(tmpPath, targetPath, function(err){
			if (err) throw err;
			if (fs.existsSync(tmpPath)){
				fs.unlink(tmpPath, function(err){
					if (err) throw err;
				});
			}
			user_mgr.getIdByName(req.session.user, function(err, id){
				if (err) console.log("getUserId: " + err);
				var image_model = new image(title, id, targetPath, getDate(), desc);
				image_mgr.addImage(image_model, function(err, id){
					var data = {title : 'Image Gallery',
							req : req,
							imageList : listImages()};
					if (err) {
						data.error = 'Error adding image';
						//TODO: remove uploaded image
					} else {
						data.success = 'File uploaded'
					}
					res.render('gallery', data);
				});
			});
		});
		
	} else {
		var data = {title : 'Image Gallery',
					req : req,
					error : 'File missing or incorrect type',
					imageList : listImages()};
		res.render('gallery', data);
	}
	
});
