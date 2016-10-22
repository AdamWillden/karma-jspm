/*
 * Copyright 2014-2015 Workiva Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var glob = require('glob');
var path = require('path');
var fs = require('fs');
var filePattern = require('./helpers/file');
var pkgJsonParser = require('./helpers/packageJsonParse');


function flatten(structure) {
  return [].concat.apply([], structure);
}

function normalize() {

  // not doing anything with ...args
  var args = Array.prototype.slice.call(arguments);
  var rawpath = path.join.apply(null, args);

  return path.normalize(rawpath);
}

function hasValue(value) {
  return value !== undefined && value !== null;
}

function initJspm(files, basePath, jspm, client, emitter) {

  // Initialize jspm config if it wasn't specified in karma.conf.js
  if (!jspm) {
    jspm = {};
  }
  if (!jspm.config) {
    jspm.config = pkgJsonParser.getJspmPackageJson(basePath).configFile || 'jspm.config.js';
  }
  if (!jspm.loadFiles) {
    jspm.loadFiles = [];
  }
  if (!jspm.serveFiles) {
    jspm.serveFiles = [];
  }
  if (!jspm.packages) {
    jspm.packages = pkgJsonParser.getJspmPackageJson(basePath).directories.packages || 'jspm_packages/';
  }
  if (!client.jspm) {
    client.jspm = {};
  }
  if (jspm.paths !== undefined && typeof jspm.paths === 'object') {
    client.jspm.paths = jspm.paths;
  }
  if (jspm.meta !== undefined && typeof jspm.meta === 'object') {
    client.jspm.meta = jspm.meta;
  }
  if (hasValue(jspm.testWrapperFunctionName)) {
    client.jspm.testWrapperFunctionName = jspm.testWrapperFunctionName;
  } else {
    client.jspm.testWrapperFunctionName = false;
  }

  // Pass on options to client
  client.jspm.useBundles = jspm.useBundles;
  client.jspm.stripExtension = jspm.stripExtension;


  /**
   * adapter
   */
  var defaultAdapter = normalize(__dirname, 'files', 'default-adapter.js');
  var adapter = null;

  if (jspm.adapter !== undefined) {

    if (jspm.adapter === 'angular2') {
      adapter = defaultAdapter;
    } else {
      adapter = normalize(basePath, jspm.adapter);
    }
  } else {
    adapter = defaultAdapter;
  }


  /**
   * preloadBySystemJS
   *
   * Add files to be preloaded before app and spec files.
   *
   * If load ( adapter === 'angular2' ) files first.
   */
  client.jspm.preloadBySystemJS = [];

  if (jspm.adapter === 'angular2') {
    client.jspm.preloadBySystemJS = require('./preloadFiles/angular2-preload-files');
  }

  if (jspm.preloadBySystemJS) {
    client.jspm.preloadBySystemJS = client.jspm.preloadBySystemJS.concat(jspm.preloadBySystemJS);
  }

  /**
   * Angular test files may wrap tests in a function named 'main'
   */
  client.jspm.testWrapperFunctionName = (hasValue(jspm.testWrapperFunctionName)) ? jspm.testWrapperFunctionName : null;


  var packagesPath = normalize(basePath, jspm.packages) + path.sep;
  var browserPath = normalize(basePath, (jspm.browserConfig || ''));
  var devPath = normalize(basePath, (jspm.dev || ''));
  var nodePath = normalize(basePath, (jspm.node || ''));
  var configFiles = Array.isArray(jspm.config) ? jspm.config : [jspm.config];
  var configPaths = configFiles.map(function(config) {
    return normalize(basePath, config);
  });

  // Add SystemJS loader and jspm config
  function getLoaderPath(fileName) {
    var exists = glob.sync(normalize(packagesPath, fileName + '@*.js'));
    if (exists && exists.length != 0) {
      return normalize(packagesPath, fileName + '@*.js');
    } else {
      return normalize(packagesPath, fileName + '.js');
    }
  }

  files.unshift(filePattern.createPattern(adapter));

  // Needed for JSPM 0.17 beta
  if (jspm.nodeConfig) {
    files.unshift(filePattern.createPattern(nodePath));
  }

  if (jspm.devConfig) {
    files.unshift(filePattern.createPattern(devPath));
  }

  if (jspm.browserConfig) {
    files.unshift(filePattern.createPattern(browserPath));
  }


  Array.prototype.unshift.apply(files,
    configPaths.map(function(configPath) {
      return filePattern.createPattern(configPath)
    })
  );

  // Coverage
  files.unshift(filePattern.createPattern(normalize(__dirname, 'files', 'hookSystemJS.js')));
  files.unshift(filePattern.createPattern(normalize(__dirname, 'files', 'instrumenter.js')));

  // SystemJS
  files.unshift(filePattern.createPattern(getLoaderPath('system.src')));
  files.unshift(filePattern.createPattern(getLoaderPath('system-polyfills.src')));
  files.unshift(filePattern.createPattern(normalize(__dirname, 'files', 'polyfills.js')));

  // Loop through all of jspm.load_files and do two things
  // 1. Add all the files as "served" files to the files array
  // 2. Expand out and globs to end up with actual files for jspm to load.
  //    Store that in client.jspm.expandedFiles
  function addExpandedFiles() {
    client.jspm.expandedFiles = flatten(jspm.loadFiles.map(function(file) {
      files.push(filePattern.createServedPattern(normalize(basePath, (file.pattern || file)), typeof file !== 'string' ? file : null));
      return filePattern.expandGlob(file, basePath);
    }));
  }

  addExpandedFiles();

  emitter.on('file_list_modified', addExpandedFiles);

  // Add served files to files array
  jspm.serveFiles.map(function(file) {
    files.push(filePattern.createServedPattern(normalize(basePath, (file.pattern || file))));
  });

  // Allow Karma to serve all files within jspm_packages.
  // This allows jspm/SystemJS to load them
  var jspmPattern = filePattern.createServedPattern(
    normalize(packagesPath, '!(system-polyfills.src.js|system.src.js)', '**'), {nocache: jspm.cachePackages !== true}
  );
  jspmPattern.watched = false;
  files.push(jspmPattern);

}

initJspm.$inject = [
  'config.files',
  'config.basePath',
  'config.jspm',
  'config.client',
  'emitter'];

module.exports = initJspm;

