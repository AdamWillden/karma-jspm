(function() {
  /*global describe, expect, it, beforeEach*/

  var path = require('path');
  var pkg = require('../src/lib/lib.packageJsonParse');
  var _ = require('lodash');
  var CONS = require('../src/lib/lib.constants');

  var normalPath = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('jspm lib.packageJsonParse', function() {

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

    describe('getRelativePathToBase', function() {

      var basePath;
      var configPath;

      beforeEach(function() {

      });

      afterEach(function() {
        basePath = null;
        configPath = null;
      });

      it('returns only file name', function() {
        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';
        configPath = 'src/client';
        var configFile = pkg.getRelativePathToBase(basePath, configPath);

        expect(normalPath(configFile)).toEqual('');
      });

      it('returns only file name', function() {
        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';
        configPath = 'client';
        var configFile = pkg.getRelativePathToBase(basePath, configPath);

        expect(normalPath(configFile)).toEqual('');
      });

      it('returns path file name', function() {
        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';
        configPath = 'client/app/src';
        var configFile = pkg.getRelativePathToBase(basePath, configPath);

        expect(normalPath(configFile)).toEqual('app/src');
      });

      it('returns path file name', function() {
        basePath = '/Users/jerryorta-dev/Dev/UIUXEngineering/src/client';
        configPath = 'app/src';
        var configFile = pkg.getRelativePathToBase(basePath, configPath);

        expect(normalPath(configFile)).toEqual('app/src');
      });

    });


  });


}).call(this);
