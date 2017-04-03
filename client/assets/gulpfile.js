var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var webpack = require('webpack-stream');


gulp.task('sass', function(){
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))

});

gulp.task('watch', ['webpack', 'sass', 'vendors-js', 'vendors-css'], function(){
    gulp.watch('sass/*.scss', ['sass']);
    gulp.watch('app/**/*.es6', ['webpack']);
});

gulp.task('webpack', function(){
    return gulp.src('app/**/*.es6')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('vendors-js', function() {
  return gulp.src([
    // add 3rd-party scripts here
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angular-storage/dist/angular-storage.min.js',
    'node_modules/angular-jwt/dist/angular-jwt.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/moment/moment.js',
    'node_modules/moment/locale/de.js',
    'node_modules/angular-moment/angular-moment.js',
    'node_modules/angular-duration-format/dist/angular-duration-format.js',
    'node_modules/angular-timer/dist/angular-timer.js',
    'node_modules/angular-timer/bower_components/humanize-duration/humanize-duration.js',
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    'node_modules/angular-filter/dist/angular-filter.js',
    'node_modules/angular-ui-notification/dist/angular-ui-notification.js',
    'node_modules/angular-filter/dist/angular-filter.js',
    'node_modules/angular-sanitize/angular-sanitize.js',
    'node_modules/angular-sc-select/dist/sc-select.js',
    'node_modules/ui-select/dist/select.js',
    'node_modules/ob-daterangepicker/dist/scripts/ob-daterangepicker.js'
    ])
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('vendors-css', function() {
  return gulp.src([
    // add 3rd-party css scripts here
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
    'node_modules/angular-ui-notification/dist/angular-ui-notification.css',
    'node_modules/angular-sc-select/dist/sc-select.css',
    'node_modules/ui-select/dist/select.css',
    'node_modules/ob-daterangepicker/dist/styles/ob-daterangepicker.css'
    ])
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build', function(callback){
    runSequence('babel',
                ['sass'],
                callback
            )
});
