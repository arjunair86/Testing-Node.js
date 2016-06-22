var gulp = require('gulp');
var beautify = require('gulp-jsbeautify');
    eslint   = require('gulp-eslint');
    uglify   = require('gulp-uglify');
 
gulp.task('beautify', function() {
  gulp.src('./t.js')
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('./build3/'));
});

gulp.task('lint', function () {
  return gulp.src(['./t.js','!node_modules/**']) 
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()
    .pipe(gulp.dest('./build/')));
});

gulp.task('compress', function() {
  return gulp.src('./t.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build2/'));
});
 
gulp.task('default', ['lint','beautify','compress'], function () {
    // This will only run if the lint task is successful... 
});