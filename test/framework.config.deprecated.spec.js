var _ = require('lodash');

(function() {
  var cwd = process.cwd();
  var path = require('path');
  var initFramework = require('../src/framework');

  var normalPath = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('jspm plugin init config', function() {
    var files, jspm, client, emitter;
    var basePath = path.resolve(__dirname, '..');

    beforeEach(function() {
      files = [];
      jspm = {
        browserConfig: 'custom_browser.js',
        config: 'custom_config.js',
        loadFiles: ['test/filesToLoad/loadFiles/**/*.js', {
          pattern: 'not-cached.js',
          nocache: true
        }, {pattern: 'not-watched.js', watched: false}],
        packages: 'custom_packages/',
        serveFiles: ['test/filesToLoad/servedFiles/fileC.js']
      };
      client = {};
      emitter = {
        on: function() {
        }
      };

    });

    it('should should work if deprecated', function() {
      initFramework(files, basePath, jspm, client, emitter);
      expect(normalPath(files[6].pattern)).toEqual(normalPath(basePath + '/custom_config.js'));
      expect(files[5].included).toEqual(true);
    });

  });

  describe('jspm plugin init array', function() {
    var files, jspm, client, emitter;
    var basePath = path.resolve(__dirname, '..');

    beforeEach(function() {
      files = [];
      jspm = {
        browserConfig: 'custom_browser.js',
        config: 'custom_config.js',
        loadFiles: ['test/filesToLoad/loadFiles/**/*.js', {
          pattern: 'not-cached.js',
          nocache: true
        }, {pattern: 'not-watched.js', watched: false}],
        packages: 'custom_packages/',
        serveFiles: ['test/filesToLoad/servedFiles/fileC.js']
      };
      client = {};
      emitter = {
        on: function() {
        }
      };

    });


    it('should support an array of config files', function() {
      jspm.config = ['custom_config.js', 'another_config.js'];
      files = [];
      initFramework(files, basePath, jspm, client, emitter);

      expect(normalPath(files[6].pattern)).toEqual(normalPath(basePath + '/custom_config.js'));
      expect(normalPath(files[7].pattern)).toEqual(normalPath(basePath + '/another_config.js'));
    });


  });

  describe('jspm plugin framework', function() {
    var files, jspm, client, emitter;
    var basePath = path.resolve(__dirname, '..');

    beforeEach(function() {
      files = [];
      jspm = {
        browserConfig: 'custom_browser.js',
        config: 'custom_config.js',
        jspmConfig: 'custom_jspm_config.js',
        loadFiles: ['test/filesToLoad/loadFiles/**/*.js', {
          pattern: 'not-cached.js',
          nocache: true
        }, {pattern: 'not-watched.js', watched: false}],
        packages: 'custom_packages/',
        serveFiles: ['test/filesToLoad/servedFiles/fileC.js']
      };
      client = {};
      emitter = {
        on: function() {
        }
      };

    });


    it('should override config with jspmConfig', function() {

      initFramework(files, basePath, jspm, client, emitter);

      var configs = _.filter(files, function(o) {
        return o.pattern.indexOf('custom_config.js') != -1;
      });

      expect(normalPath(files[6].pattern)).toEqual(normalPath(basePath + '/custom_jspm_config.js'));
      expect(configs.length).toEqual(0);
    });


  });
}).call(this);
