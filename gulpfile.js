let browserSync = require('browser-sync'),
		gulp = require('gulp'),

		postcss = require('gulp-postcss'),
		autoprefixer = require('autoprefixer'),
		cssnano = require('cssnano')

		sass = require('gulp-sass'),
		image = require('gulp-image'),
		media = require('gulp-group-css-media-queries'),
		notify = require('gulp-notify'),
		pug = require('gulp-pug');


gulp.task('browserSync', function () {
	browserSync({
		server: {
			baseDir: 'assets'
		},
		notify: false
	})
});

gulp.task('postcss', function () {
	const processor = ([
		autoprefixer({browsers: ['last 2 versions', 'safari 5']}),
		cssnano()
	]);
	return gulp.src('./assets/sass/*.sass')
		.pipe(sass().on("error", notify.onError()))
		.pipe(media())
		.pipe(postcss(processor))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('image', function () {
	return gulp.src('./assets/img/**/*')
		.pipe(image())
		.pipe(gulp.dest('./assets/img/'))
})

gulp.task('pug', function buildHTML() {
	return gulp.src('assets/*.pug')
		.pipe(pug({
			pretty: true
		}).on("error", notify.onError()))
		.pipe(gulp.dest('assets'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', ['postcss', 'pug', 'browserSync'], function () {
	gulp.watch('assets/sass/**/*.sass', ['postcss']);
	gulp.watch(['assets/*.pug', 'assets/pug/**/*.pug'], ['pug']);
	gulp.watch('assets/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
