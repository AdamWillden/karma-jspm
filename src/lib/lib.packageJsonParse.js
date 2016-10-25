var path = require('path');
var CONS = require('./lib.constants');
var _ = require('lodash');
var readPkgJson = require('./lib.readPackageJson');
var getRelativePathToBase = require('./lib.getRelativePathToBase').getRelativePathToBase;
var validate = require('./lib.validate');
var normalize = require('./lib.path').normalize;

var basePath;

function destroy() {
  basePath = null;
}

function hasFileExtension(path) {
  return validate.isJSExt(path) || validate.isTSExt(path);
}

function hasConfigType_WITH_fileExtension(pjson, typeConfig) {
  return validate.hasValue(pjson.jspm.configFiles) &&
    validate.hasValue(pjson.jspm.configFiles[typeConfig]) &&
    hasFileExtension(pjson.jspm.configFiles[typeConfig]);
}

function getConfigFileByType(typeConfig) {
  if (typeConfig === CONS.PKG_JSPM_CONFIGFILES_KEYS.JSPM) {
    return CONS.CONFIG;
  } else if (typeConfig === CONS.PKG_JSPM_CONFIGFILES_KEYS.DEV) {
    return CONS.CONFIG_DEV;
  } else if (typeConfig === CONS.PKG_JSPM_CONFIGFILES_KEYS.BROWSER) {
    return CONS.CONFIG_BROWSER;
  } else if (typeConfig === CONS.PKG_JSPM_CONFIGFILES_KEYS.NODE) {
    return CONS.CONFIG_NODE;
  } else {
    throw new Error('typeConfig ' +  typeConfig + ' does not match any jspm.configFiles');
  }
}

/**
 *
 * @param pjson - package.json object
 * @param typeConfig - 'jspm' | 'jspm:dev' | 'jspm:browser' | 'jspm:node'
 */
function getConfigFile(pjson, hasBaseUrl, typeConfig) {
  var configFile;

  /**
   * There is a baseURL node in the package.json
   */
  if (hasBaseUrl) {

    /**
     * There is a configFiles key
     */
    if (hasConfigType_WITH_fileExtension(pjson, typeConfig)) {
      configFile = path.join(pjson.jspm.directories.baseURL, pjson.jspm.configFiles[typeConfig]);
    } else {
      configFile = path.join(pjson.jspm.directories.baseURL, getConfigFileByType(typeConfig));
    }

  } else {

    /**
     * There is a configFiles key
     */
    if (hasConfigType_WITH_fileExtension(pjson, typeConfig)) {
      configFile = pjson.jspm.configFiles[typeConfig];
    } else {
      configFile = getConfigFileByType(typeConfig);
    }
  }

  return configFile;
}

/**
 * Paths are relative to project root directory
 *
 * @param pathToPackageJsonForTesting - optional
 * @returns {{}}
 */
function getJspmPackageJson(basePath) {

  var pjson = readPkgJson.readPackageJson();
  var cfg = {};

  // prevent parse errors
  if (!pjson.jspm) {
    pjson.jspm = {};
  }

  var hasDirectories = ( pjson.jspm.directories !== undefined );
  var hasPackages = (hasDirectories &&  pjson.jspm.directories.packages);
  var hasConfigFiles = ( pjson.jspm.configFiles !== undefined );


  if (pjson.jspm) {
    for (var p in pjson.jspm) {
      cfg[p] = pjson.jspm[p];
    }
  }

  cfg.directories = pjson.jspm.directories || pjson.directories || {};
  cfg.configFiles = pjson.jspm.configFiles || {};

  /**
   * baseURL
   * @type {boolean}
   */
  var hasBaseUrl = false;
  if ( cfg.directories.baseURL === undefined ) {
    cfg.directories.baseURL = '';
  } else {
    hasBaseUrl = true;
  };

  /**
   * jspm beta 0.17
   *
   * configFile
   */
  cfg.jspmConfig = getRelativePathToBase(basePath, path.normalize(getConfigFile(pjson, hasBaseUrl, CONS.PKG_JSPM_CONFIGFILES_KEYS.JSPM)));
  cfg.browserConfig = getRelativePathToBase(basePath, path.normalize(getConfigFile(pjson, hasBaseUrl, CONS.PKG_JSPM_CONFIGFILES_KEYS.BROWSER)));
  cfg.devConfig = getRelativePathToBase(basePath, path.normalize(getConfigFile(pjson, hasBaseUrl, CONS.PKG_JSPM_CONFIGFILES_KEYS.DEV)));
  cfg.nodeConfig = getRelativePathToBase(basePath, path.normalize(getConfigFile(pjson, hasBaseUrl, CONS.PKG_JSPM_CONFIGFILES_KEYS.NODE)));

  /**
   * packages
   */
  if (hasDirectories) {
    if (hasPackages) {
      cfg.directories.packages = getRelativePathToBase(basePath, path.normalize(pjson.directories.packages));
    } else if (hasBaseUrl) {
      cfg.directories.packages = getRelativePathToBase(basePath, path.normalize(path.join(cfg.directories.baseURL, CONS.PACKAGES)));
    } else {
      cfg.directories.packages = CONS.PACKAGES;
    }
  }

  return cfg;
}

module.exports = {
  test                    : readPkgJson.test,
  getJspmPackageJson      : getJspmPackageJson,
  getRelativePathToBase   : getRelativePathToBase,
  destroy                 : destroy
};
