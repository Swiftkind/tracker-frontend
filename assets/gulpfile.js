var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var del = require('del'); // delete the files
var runSequence = require('run-sequence');
var babel = require('gulp-babel');


gulp.task('sass', function(){
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))

});

gulp.task('watch', ['babel', 'sass'], function(){
    gulp.watch('app/**/*.es6', ['babel']);
    gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('babel', function(){
    return gulp.src('app/**/*.es6')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('build', function(callback){
    runSequence('babel',
                ['fonts', 'sass'],
                callback
            )
});
