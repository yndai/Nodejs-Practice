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

function listFolderImages(){
	var arr = [];
	fs.readdirSync("public/images").forEach( function(file){
		arr.push("/images/" + file);
	});
	return arr;
}

function render(req, res, data) {
	image_mgr.listImages(function(err, rows){
		data.imageList = rows;
		res.render('gallery', data);
	});
}

app.get('/gallery', function(req, res, next){
	var data = {title : 'Image Gallery',
				req : req};
	render(req, res, data);
});

app.post('/gallery', function(req, res, next){
	
	if (req.files.image && req.files.image.type.match(/image\/\s*/)){
		var tmpPath = req.files.image.path;
		var targetName = getTimestamp() + "-" + req.files.image.name;
		var targetPath = 'public/images/' + targetName;
		var resourcePath = '/images/' + targetName;
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
				var image_model = new image(title, id, resourcePath, getDate(), desc);
				image_mgr.addImage(image_model, function(err, id){
					var data = {title : 'Image Gallery',
								req : req};
					if (err) {
						data.error = 'Error adding image';
						//TODO: remove uploaded image
					} else {
						data.success = 'File uploaded'
					}
					render(req ,res, data);
				});
			});
		});
		
	} else {
		var data = {title : 'Image Gallery',
					req : req,
					error : 'File missing or incorrect type'};
		render(req, res, data);
	}
});
