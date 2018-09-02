const gulp = require('gulp');
const gulpJade = require('gulp-jade');
const less = require('gulp-less');
const minifyCss = require('gulp-csso');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('jade', () => {
	gulp.src('src/templates/*.jade')
		.pipe(gulpJade())
		.pipe(gulp.dest('build'))
})

gulp.task('styles', () => {
	gulp.src('src/styles/*.less')
		.pipe(less())
		.pipe(minifyCss())
		.pipe(gulp.dest('build'))
})

gulp.task('js', () => {
	gulp.src('src/js/*.js')
		.pipe(concat('all.js'))
		.pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(uglify())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'))
})

gulp.task('copyAndDel', () => {
	gulp.src('build')
		.pipe(gulp.dest('build/copy/'))
		del.sync('build/copy');
});

gulp.task('watch', ['jade', 'styles', 'js'], () => {
	gulp.watch('src/templates/*.jade', ['jade'])
	gulp.watch('src/styles/*.less', ['styles'])
	gulp.watch('src/js/*.js', ['js'])
})

gulp.task('build', ['jade', 'styles', 'js'])

gulp.task('serve', ['jade', 'styles', 'js'], () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    browserSync.watch('src').on('change', browserSync.reload)
});