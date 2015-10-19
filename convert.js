var 
fs = require("node-fs-extra"),
path = require("path")
mime = require('mime'),
sizeOf = require('image-size'),
prompt = require('prompt'),
open = require("open"),
gulp = require("gulp"),
chug = require("gulp-chug"),
imagesDir = path.join('images'),
prompt.message = "Please select a directory ".cyan,
prompt.delimiter = "",
directories = fs.readdirSync(imagesDir),

	// jpeg = require('imagemin-jpeg-recompress'), /*FOR MAC INSTEAD OF MOZJPEG*/
	mozjpeg = require('imagemin-mozjpeg'),
	pngquant = require('imagemin-pngquant'),
	optipng = require('imagemin-optipng'),
	svgo = require('imagemin-svgo'),	

	source = 'input/',
	dest = 'output/',
	images = {
		in: source + 'images/*.*',
		out: dest + 'images/'
	},	
	properties = [{
		name: 'Images', 
		description:'Please select a directory: ',
		validator: /^[0-9]+$/,
		warning: 'Only use numbers'.red
	}];


process.stdout.write("\u001b[2J\u001b[0;0H");
directories.forEach(function(dir,index){
	console.log('['+index+'] ' + dir);
});	
prompt.get(properties, function (err, result) {
	if(result.Images>=directories.length){
		console.log("Directory Number not valid. QUIT");
		return false;
	}
	var 
	selectedProject = directories[result.Images],
	newPath = path.join('images','/',selectedProject,'/'),
	compressed = path.join(newPath,'compressed','/');

	gulp.task('images', function() {
		return gulp.src(newPath+'*.*')
			// .pipe(newer(newPath))
			.pipe(pngquant({quality: '50-80', speed: 4})())
			.pipe(optipng({optimizationLevel: 3})())
			.pipe(mozjpeg({quality: 80})()) /*use on windows*/
			//.pipe(jpeg()()) /*use on mac*/
			
			.pipe(svgo()())
			.pipe(gulp.dest(compressed));
	});

	gulp.task('createURI',['images'],function(){
		dataURI = newPath + 'dataURI.css';
		if (fs.existsSync(dataURI)) {
			fs.unlinkSync(dataURI);
		}
		fs.writeFileSync(dataURI, '');
		var images = {};
		var files = fs.readdirSync(compressed);

		for(var i in files) {
			var file = fs.readFileSync(compressed + files[i]);
			var fileName = files[i];
			var mimeType = mime.lookup(compressed + files[i]); 
			if(files[i].match(/(jpg|png|gif|svg)/gi)){
				var dimensions = sizeOf(compressed + files[i]);
				var width = dimensions.width;
				var height = dimensions.height;
				fs.appendFileSync(dataURI, '\/\*'+fileName + '\*\/ \r\n');
			  	var base64Image = new Buffer(file, 'binary').toString('base64');
			  	fs.appendFileSync(dataURI, 'background:\r\n    url(data:'+mimeType+';base64,'+base64Image+')\r\n    no-repeat\r\n    0px 0px;\r\n    width:'+width+'px;\r\n    height:'+height+'px;\r\n' + '\r\n\r\n');
		  	}
		}
		console.log("done");
	});
	
	gulp.start('createURI'); 	
















		


});
function onErr(err) {
	console.log(err);
	return 1;
}





