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
    pjson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), pathToPackageJsonForTesting)));
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
