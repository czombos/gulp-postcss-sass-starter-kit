var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync');
var prefix       = require('gulp-autoprefixer');
var uglify       = require('gulp-uglify');
var rename       = require("gulp-rename");
var imagemin     = require("gulp-imagemin");
var pngquant     = require('imagemin-pngquant');
var cache        = require('gulp-cache');

input  = {
	'sass': 'sass/**/*.sass',
	'javascript': 'js/*.js',
	'images': 'images/original/**/*'
},

output = {
	'stylesheets': 'css',
	'javascript': 'js/min',
	'images': 'images'
};

gulp.task('sass', function () {
	gulp.src(input.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['scss'],
			outputStyle: 'compressed'
		}))
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(output.stylesheets));
});

gulp.task('browser-sync', function() {
	browserSync.init(['css/*.css', 'js/**/*.js', '**/*.html', '**/*.php'], {
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('scripts', function() {
	gulp.src(input.javascript)
	.pipe(uglify())
	.pipe(rename({suffix: ".min"}))
	.pipe(gulp.dest(output.javascript))
});

gulp.task('images', function () {
	return gulp.src(input.images)
	.pipe(cache(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest(output.images));
});

gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

gulp.task('watch', function() {
	gulp.watch(input.sass, ['sass']);
	gulp.watch(input.javascript, ['scripts']);
	gulp.watch(input.images, ['images']);
});

gulp.task('default', ['clear', 'browser-sync', 'watch']);
