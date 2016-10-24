(function() {
  /*global describe, expect, it, beforeEach*/

  var path = require('path');
  var pkg = require('../src/helpers/helper.packageJsonParse');
  var _ = require('lodash');
  var CONS = require('../src/helpers/helper.constants');

  var normalPath = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('jspm helper.packageJsonParse', function() {

    var pathToTestPackageJson;


    beforeEach(function() {

      pkg.destroy();


      pathToTestPackageJson = function(pkgJson) {
        return 'test/packageJson/' + pkgJson;
      }

    });

    afterEach(function() {
      pathToTestPackageJson = null;

    });

    describe('directories', function() {

      var basePath;

      beforeEach(function() {

      });

      afterEach(function() {
        basePath = null;
      });

      it('should define directories.packages', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directores.baseURL-package.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(karmaJspmConfig.directories).toBeDefined();
        expect(normalPath(karmaJspmConfig.directories.baseURL)).toEqual('');
        expect(normalPath(karmaJspmConfig.directories.packages)).toEqual('jspm_packages');

      });

      it('should define directories.packages', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directores.baseURL-package.json'));

        var karmaJspmConfig = pkg.getJspmPackageJson(basePath);

        expect(karmaJspmConfig.directories).toBeDefined();
        expect(normalPath(karmaJspmConfig.directories.baseURL)).toEqual('client');
        expect(normalPath(karmaJspmConfig.directories.packages)).toEqual('client/jspm_packages');

      });

      it('should return packages path with baseURL', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directories-package.json'));

        var pjson = pkg.getJspmPackageJson(basePath);

        expect(pjson.directories).toBeDefined();
        expect(normalPath(pjson.directories.baseURL)).toBe('');
        expect(normalPath(pjson.directories.packages)).toBe('jspm_packages');

      });

      it('should return packages path with baseURL', function() {

        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';

        // For Testing Only
        pkg.test(pathToTestPackageJson('jspm.directories-package.json'));

        var pjson = pkg.getJspmPackageJson(basePath);

        console.log(pjson);

      });
    });

  });


}).call(this);
