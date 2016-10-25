var path = require('path');
var fs = require('fs');

var pathToPackageJsonForTesting;

function test(_pathToPackageJsonForTesting) {
  pathToPackageJsonForTesting = _pathToPackageJsonForTesting;
}

function readPackageJson() {

  pathToPackageJsonForTesting = (pathToPackageJsonForTesting) ? pathToPackageJsonForTesting : 'package.json';

  var pjson = {};

  try {
    var rawPjson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), pathToPackageJsonForTesting)));
    pjson = rawPjson.jspm ? rawPjson.jspm : pjson;
  }
  catch (e) {
    pjson = {};
  }

  return pjson;
}

module.exports = {
  test                    : test,
  readPackageJson         : readPackageJson
};
