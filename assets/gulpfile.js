var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var del = require('del'); // delete the files
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var concat = require('gulp-concat');


gulp.task('sass', function(){
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))

});

gulp.task('watch', ['babel', 'sass', 'vendors'], function(){
    gulp.watch('sass/*.scss', ['sass']);
     gulp.watch('app/**/*.es6', ['babel']);
});

gulp.task('babel', function(){
    return gulp.src('app/**/*.es6')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('vendors', function() {
  return gulp.src([
    // add 3rd-party scripts here
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js'])
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', function(callback){
    runSequence('babel',
                ['fonts', 'sass'],
                callback
            )
});
