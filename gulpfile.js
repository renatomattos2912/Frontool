// include gulp
var gulp = require('gulp'); 
var gutil = require('gulp-util');
 
// include plug-ins
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var watch = require('gulp-watch');
var stripDebug = require('gulp-strip-debug');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var cache = require('gulp-cache');
var es = require('event-stream');
var seq = require('run-sequence');

/*
 * CLEAN BLOCK
 */

// Cleam TMP folder on the SRC
gulp.task('clean-tmp', function() {	
	gulp.src('./src/tmp', {read: false})					
		.pipe(clean())	
});

// Cleam Build folder
gulp.task('clean-build', function() {
    return gulp.src('./build', {read: false})    	
    	.pipe(clean({force: true}));
});

/*
 * HTML and IMG BLOCK
 */

//Move HTML pages
gulp.task('html', function() { 	 	 
	 return gulp.src('./src/pages/**')
	 	.pipe(changed('./build/**/*'))
	    .pipe(gulp.dest('./build/'))
});

// Minify and move images
gulp.task('image', function() {
	return gulp.src('./src/images/**/*')   
		.pipe(changed('./build/images/**/*'))
	    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))	    
	    .pipe(gulp.dest('./build/assets/images/'))	    
	    .on('errors', gutil.log)
});

// Move fonts
gulp.task('font', function(){				
	return gulp.src(['./src/fonts/**/*'])
		.pipe(gulp.dest('./build/assets/fonts/'))	
});

// Run Jekyll to put site online
gulp.task('jekyll', function (){
	var exec = require('child_process').exec;
	exec('cd /vagrant/build && jekyll build', function(err, stdout, stderr) {
	    console.log(stdout);	    
	});
});

/*
 * STYLE BLOCK
 */

// Compile SASS files
gulp.task('sass', function(){
	return gulp.src('./src/styles/scss/main.scss')
	    .pipe(sass())				    
	    .pipe(gulp.dest('./src/tmp/'))				    		    
	    .on('errors', gutil.log)
});

// Concat and minify all the css files in one css after compile SASS
gulp.task('style', ['sass'], function(){
	return gulp.src(['./src/styles/css/**/*.css', './src/tmp/*.css'])
		.pipe(concat('style.min.css'))	 
		.pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	    .pipe(minifyCSS())				    
	    .pipe(gulp.dest('./build/assets/styles/'))	        
	    .on('error', gutil.log)
});

//Concat and minify all the css files in one css after compile SASS
gulp.task('style-vendor', function(){
	return gulp.src(['./src/styles/vendor/**/*.css'])
		.pipe(concat('vendor.min.css'))	 
		.pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	    .pipe(minifyCSS())				    
	    .pipe(gulp.dest('./build/assets/styles/'))	        
	    .on('error', gutil.log)
});

/*
 * SCRIPT BLOCK
 */

// Scripts
gulp.task('coffee', function() {
	return gulp.src('./src/scripts/coffee/**/*.coffee')
	    .pipe(coffee({bare: true}))
	    .pipe(gulp.dest('./src/tmp/'))
	    .on('error', gutil.log)
});

gulp.task('script',['coffee'],function(){	
	return gulp.src([	                 
                     './src/scripts/js/**/*.js',
                     './src/tmp/*.js'
                    ])                
        .pipe(concat('script.min.js')) 
        .pipe(stripDebug())
        .pipe(uglify())        
        .pipe(gulp.dest('./build/assets/scripts/'))
    	.on('error', gutil.log)
});

gulp.task('script-vendor', function(){	
	return gulp.src([
	                 './src/scripts/vendor/jquery/jquery-1.10.2.js',
                     './src/scripts/vendor/bootstrap/bootstrap.js',                                                              
                     './src/scripts/vendor/**/*.js'                     
                    ])                
        .pipe(concat('vendor.min.js')) 
        .pipe(stripDebug())
        .pipe(uglify())        
        .pipe(gulp.dest('./build/assets/scripts/'))
    	.on('error', gutil.log)
});

/*
 * BUILD BLOCK
 */

// Build the project and put it online
gulp.task('build', function(cb) {
	seq('clean-build', ['style-vendor', 'style', 'script-vendor', 'script', 'html', 'image', 'font'], 'jekyll', cb);
});

// Make all the magic
gulp.task('default', ['build'], function(cb) {			
 
	gulp.watch(['./src/scripts/vendor/**/*'], ['script-vendor']);
	
	gulp.watch(['./src/scripts/**/*', '!./src/scripts/vendor/**/*'], ['script']);    
	
    gulp.watch(['./src/styles/vendor/**/*'], ['style-vendor']);
    
    gulp.watch(['./src/styles/**/*', '!./src/styles/vendor/**/*'], ['style']);
    
    gulp.watch(['./build/assets/styles/**/*', './build/assets/scripts/**/*'], ['clean-tmp', 'jekyll']);       
       
    gulp.watch('./src/images/**/*', ['image', 'jekyll']);   
 
    gulp.watch('./src/pages/**/*', ['html', 'jekyll']);
    
    gulp.watch('./src/fonts/**/*', ['font', 'jekyll']);       
});



