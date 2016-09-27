var browserify = require('browserify');
var gulp = require('gulp');
var bump = require('gulp-bump');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var Promise = require("bluebird");
var yargs = require('yargs');
var fs = require('fs');
var git = require('gulp-git');
var childProcess = require('child_process');
// var gulpLoadPlugins = require('gulp-load-plugins');

var pkg;
var argv = yargs.argv;
var spawn = childProcess.spawn;

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


gulp.task('bump.patch', function(done){
  pushVersion(done, {bumpType: 'patch'});
});

var files = [
  './**/!(.git)*',
  '!./node_modules{,/**/*}',
  '!./.idea{,/**/*}'
];

function bumpVersion(config) {

  return new Promise(function(resolve, reject) {
    gulp.src('./package.json')
      .pipe( bump({type: config.bumpType}))
      .pipe(gulp.dest('./'))
      .on('end', resolve)
      .on('error', reject);
  });

}

function readPackageJson() {
   var src = './package.json';

  console.log('readPackageJson');
  return new Promise(function(resolve, reject) {
    fs.readFile(src, "utf8", function(err, data) {

      if (data) {
        pkg = JSON.parse(data);

        // https://github.com/UIUXEngineering/uidk-ng-1x-translation.git
        pkg.repository.url = pkg.repository.url.replace('git+', '');

        resolve();
      }

      if (err) {
        reject();
      }

    });
  });

}

function add() {

  return new Promise(function(resolve, reject) {
    gulp.src(files)
      .pipe(git.add())
      .on('end', resolve)
      .on('error', reject);
  });

}

function commit() {

  console.log('git commit');
  return new Promise(function(resolve, reject) {
    gulp.src(files)
      .pipe(git.commit('bump to version v' + pkg.version, {emitData: true}))
      .on('data', function(data) {
        // gutil.log(data);
      })
      .on('end', resolve)
      .on('error', reject);
  });


}

function pushToMaster() {

  console.log('pushToMaster');
  return new Promise(function(resolve, reject) {
     git.push('origin', 'master', function(err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function tag() {

  console.log('git tag');
  var tag = 'v' + pkg.version;

  return new Promise(function(resolve, reject) {
     git.tag(tag, 'release version ' + pkg.version, function(err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function pushTag() {

  console.log('git push');
  var tag = 'v' + pkg.version;

  return new Promise(function(resolve, reject) {
     git.push('origin', tag, function(err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function publish() {

  console.log('npm publish');
  var options = {
    stdio: 'inherit',
    cwd: './'
  };

  return new Promise(function(resolve, reject) {
    spawn('npm', ['publish'], options)
      .on('close', resolve)
      .on('error', reject);
  });
}

function pushVersion(done, config) {

  config.bumpType = config.bumpType ? config.bumpType : 'patch';

  bumpVersion(config).then(function() {
    // read from component source
    return readPackageJson();
  }).then(function() {
    return add();
  }).then(function() {
    return commit();
  }).then(function() {
    return pushToMaster();
  }).then(function() {
    return tag();
  }).then(function() {
    pushTag();
  }).then(function() {
    publish();
  }).then(function() {
    done();
  })

}
