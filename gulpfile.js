var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var pngquant     = require('imagemin-pngquant');
var cache        = require('gulp-cache');

gulp.task('sass', function() {
	gulp.src('sass/**/*.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(prefix('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
	.pipe(sourcemaps.write('./'))
	.pipe(plumber())
	.pipe(gulp.dest('css'));
});

gulp.task('browser-sync', function() {
	browserSync.init(['css/*.css', 'js/**/*.js', '**/*.html', '**/*.php'], {
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('scripts', function() {
	gulp.src('js/*.js')
	.pipe(uglify())
	.pipe(rename({
		dirname: "min",
		suffix: ".min",
	}))
	.pipe(gulp.dest('js'))
});

gulp.task('images', function () {
	return gulp.src('images/original/**/*')
	.pipe(cache(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('images/'));
});

gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

gulp.task('default', ['clear', 'sass', 'browser-sync', 'scripts', 'images'], function () {
	gulp.watch('sass/**/*.sass', ['sass']);
	gulp.watch('js/**/*.js', ['scripts']);
	gulp.watch('images/*', ['images']);
});
