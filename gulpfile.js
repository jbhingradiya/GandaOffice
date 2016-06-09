var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var del = require('del');

// Clean up
gulp.task('clean', del.bind({force: true}, ['htdocs/**']));

gulp.task('browserify', function() {
  gulp.src('src/js/main.js')
    .pipe(browserify({transform:'reactify'}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('htdocs/js'));
});

gulp.task('copy', function() {
  gulp.src('src/assets/**')
    .pipe(gulp.dest('htdocs/assets/'));

  gulp.src('src/config.js')
    .pipe(gulp.dest('htdocs'));

  gulp.src('src/manifest.appcache')
    .pipe(gulp.dest('htdocs'));

  gulp.src('src/index.html')
    .pipe(gulp.dest('htdocs'));
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});
