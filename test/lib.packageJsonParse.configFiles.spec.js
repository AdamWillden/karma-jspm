(function() {
  /*global describe, expect, it, beforeEach*/

  var path = require('path');
  var _ = require('lodash');

  var normalize = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('jspm lib.packageJsonParse', function() {

    var pathToTestPackageJson;
    var pkg;
    var CONS;


    beforeEach(function() {
      pkg = require('../src/lib/lib.packageJsonParse');
      CONS = require('../src/lib/lib.constants');

      pkg.destroy();


      pathToTestPackageJson = function(pkgJson) {
        return 'test/packageJson/' + pkgJson;
      }

    });

    afterEach(function() {
      pathToTestPackageJson = null;

    });

    describe('configFiles', function() {

      var basePath;

      beforeEach(function() {

      });

      afterEach(function() {
        basePath = null;
      });

      it('should find different configs relative to basePath src/client', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directores.baseURL.configFiles.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(karmaJspmConfig.jspmConfig).toEqual('jspm.config.js');
        expect(karmaJspmConfig.devConfig).toEqual('jspm.dev.js');
        expect(karmaJspmConfig.browserConfig).toEqual('jspm.browser.js');
        expect(karmaJspmConfig.nodeConfig).toEqual('jspm.node.js');


      });

      it('should find different configs relative to basePath src', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directores.baseURL.configFiles.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(normalize( karmaJspmConfig.jspmConfig )).toEqual('client/jspm.config.js');
        expect(normalize( karmaJspmConfig.devConfig )).toEqual('client/jspm.dev.js');
        expect(normalize( karmaJspmConfig.browserConfig )).toEqual('client/jspm.browser.js');
        expect(normalize( karmaJspmConfig.nodeConfig )).toEqual('client/jspm.node.js');


      });

      it('should find different configs relative to basePath project root', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directores.baseURL.configFiles.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(normalize( karmaJspmConfig.jspmConfig )).toEqual('src/client/jspm.config.js');
        expect(normalize( karmaJspmConfig.devConfig )).toEqual('src/client/jspm.dev.js');
        expect(normalize( karmaJspmConfig.browserConfig )).toEqual('src/client/jspm.browser.js');
        expect(normalize( karmaJspmConfig.nodeConfig )).toEqual('src/client/jspm.node.js');


      });

      it('should find different configs with different paths relative to basePath', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.configFiles.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(normalize( karmaJspmConfig.jspmConfig )).toEqual('src/browser/jspm.config.js');
        expect(normalize( karmaJspmConfig.devConfig )).toEqual('jspm.dev.js');
        expect(normalize( karmaJspmConfig.browserConfig )).toEqual('jspm.browser.js');
        expect(normalize( karmaJspmConfig.nodeConfig )).toEqual('jspm.node.js');

      });


      it('should find different configs with different paths project root', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.configFiles.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(normalize( karmaJspmConfig.jspmConfig )).toEqual('src/browser/jspm.config.js');
        expect(normalize( karmaJspmConfig.devConfig )).toEqual('jspm.dev.js');
        expect(normalize( karmaJspmConfig.browserConfig )).toEqual('jspm.browser.js');
        expect(normalize( karmaJspmConfig.nodeConfig )).toEqual('jspm.node.js');

      });
    });

  });


}).call(this);
