var path = require('path');
var fs = require('fs');
var CONS = require('./helper.constants');
var _ = require('lodash');
var pHelper = require('./helper.path');
var readPkgJson = require('./helper.readPackageJson');
var getRelativePathToBase = require('./helper.getRelativePathToBase').getRelativePathToBase;

var basePath;

function destroy() {
  basePath = null;
}

/**
 * Paths are relative to project root directory
 *
 * @param pathToPackageJsonForTesting - optional
 * @returns {{}}
 */
function getJspmPackageJson(basePath) {

  var pjson = readPkgJson.readPackageJson();
  var jspmConfig = {};

  var hasDirectories = ( pjson.jspm.directories !== undefined );
  var hasPackages = (hasDirectories &&  pjson.jspm.directories.packages);
  var hasConfigFiles = ( pjson.jspm.configFiles !== undefined );
  var hasBaseUrl = false;

  // prevent parse errors
  if (!pjson.jspm) {
    pjson.jspm = {};
  }

  if (pjson.jspm) {
    for (var p in pjson.jspm) {
      jspmConfig[p] = pjson.jspm[p];
    }
  }

  jspmConfig.directories = pjson.jspm.directories || pjson.directories || {};
  jspmConfig.configFiles = pjson.jspm.configFiles || {};

  if ( jspmConfig.directories.baseURL === undefined ) {
    jspmConfig.directories.baseURL = '';
  } else {
    hasBaseUrl = true;
  };

  /**
   * jspm beta 0.17
   * configFile
   */
  if (pjson.jspm.configFiles && pjson.jspm.configFiles.jspm) {

    // Contains the entire path
    jspmConfig.configFile = pjson.jspm.configFiles.jspm;
  } else if (hasBaseUrl) {
    jspmConfig.configFile = path.join(jspmConfig.directories.baseURL, CONS.CONFIG);
  } else {
    jspmConfig.configFile = CONS.CONFIG;
  }

  /**
   * packages
   */
  if (hasDirectories) {

    if (hasPackages) {
      jspmConfig.directories.packages = pjson.directories.packages;
    } else if (hasBaseUrl) {
      jspmConfig.directories.packages = path.join(jspmConfig.directories.baseURL, CONS.PACKAGES);
    } else {
      jspmConfig.directories.packages = CONS.PACKAGES;
    }
  }

  // Normalize Paths
  var configFilePath = jspmConfig.configFile.split(path.sep);
  var configFile = _.last(configFilePath);
  var configFileBasePath = getRelativePathToBase(basePath,  _.join(_.initial(configFilePath), path.sep));
  jspmConfig.directories.baseURL = configFileBasePath;
  jspmConfig.configFile = path.join(configFileBasePath, configFile);

  var jspmPackagesFilePath = jspmConfig.directories.packages.split(path.sep);
  var jspmPackages = _.last(jspmPackagesFilePath);
  var jspmPackagesBasePath = getRelativePathToBase(basePath, _.join(_.initial(jspmPackagesFilePath), path.sep));
  jspmConfig.directories.packages = path.join(jspmPackagesBasePath, jspmPackages);

  return jspmConfig;
}

module.exports = {
  test                    : readPkgJson.test,
  getJspmPackageJson      : getJspmPackageJson,
  getRelativePathToBase   : getRelativePathToBase,
  destroy                 : destroy
};
