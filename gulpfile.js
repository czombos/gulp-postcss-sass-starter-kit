var gulp = require('gulp'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglify'),
	include = require("gulp-include"),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

var postcss = require('gulp-postcss'),
	sass = require('gulp-sass'),
	cssImport = require('postcss-import'),
	autoprefixer = require('autoprefixer'),
	cssnext = require('gulp-cssnext'),
	mqpacker = require('css-mqpacker'),
	cssnano = require('cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	pixrem = require('pixrem');

gulp.task('css', function(){
	var processors = [
		cssImport,
		autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
		mqpacker,
		pixrem,
		cssnano
	];
	return gulp.src('./sass/style.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(cssnext({compress: true }))
		.pipe(postcss(processors))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('./css'));
});

gulp.task('js', function(){
	return gulp.src('./js/global.js')
		.pipe(include()).on('error', console.log)
		.pipe(rename('global.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./js'))
    		.pipe(reload({stream:true}));
});

gulp.task('serve, function(){
	browserSync({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('watch', function(){
	gulp.watch('./css/**/*.css', ['css', browserSync.reload]);
	gulp.watch('./js/**/*.js', ['js', browserSync.reload]);
	gulp.watch('*.html', browserSync.reload);
});

gulp.task('default', ['css', 'serve', 'js', 'watch']);
