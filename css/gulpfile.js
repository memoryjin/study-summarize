const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const less = require('gulp-less');
const path = require('path');
const plugins = [
	autoprefixer({browsers: ['>1%', 'last 5 version']})
];
 
gulp.task('less', function () {
  return gulp.src('./*.less')
    .pipe(less())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./'));
});