var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('instrumenter', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/coverage/instrumenterIndex.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('instrumenter.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('src/files/'));
});

gulp.task('bump.major', function(){
  gulp.src('./package.json')
    .pipe(bump({type:'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump.minor', function(){
  gulp.src('./package.json')
    .pipe(bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump.patch', function(){
  gulp.src('./package.json')
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});
