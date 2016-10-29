var glob = require('glob');

function expandGlob(file, cwd) {
  return glob.sync(file.pattern || file, {cwd: cwd});
}

var createPattern = function (path) {
  return {pattern: path, included: true, served: true, watched: false};
};

/**
 * @DEPRECATED
 * @param path
 * @param file
 * @returns {{pattern: *, included: boolean, served: boolean, nocache: boolean, watched: boolean}}
 */
var createServedPattern = function(path, file){
  return {
    pattern: path,
    included: file && 'included' in file ? file.included : false,
    served: file && 'served' in file ? file.served : true,
    nocache: file && 'nocache' in file ? file.nocache : false,
    watched: file && 'watched' in file ? file.watched : true
  };
};

/**
 * http://karma-runner.github.io/1.0/config/files.html
 *
 * Because systemjs is used to load files, there
 * is only one configuration to load files that
 * works.
 *
 * @param path
 */
var createSystemJSPattern = function(path) {
  return {
    pattern: path,

    // Not using <script> tags to load files, systemjs is loading them.
    included: false,

    // Karma is serving the file
    served: true,

    // Not serving from the file system, serving from karma server
    nocache: false,

    // Re-test is file changes
    watched: true
  };
};

module.exports = {
  expandGlob: expandGlob,
  createPattern: createPattern,
  createServedPattern: createServedPattern,
  createSystemJSPattern: createSystemJSPattern
};
