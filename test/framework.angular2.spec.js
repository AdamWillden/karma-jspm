(function() {

  var cwd = process.cwd();
  var path = require('path');
  var initFramework = require('../src/framework');

  var normalPath = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('jspm plugin init with angular2 adapter', function() {
    var files, jspm, client, emitter;
    var basePath = path.resolve(__dirname, '..');

    beforeEach(function() {
      files = [];
      jspm = {
        browserConfig: 'custom_browser.js',
        jspmConfig: 'custom_config.js',
        files: [
          'src/**/*.js',
          {
            pattern: 'not-cached.js',
            nocache: true
          },
          {
            pattern: 'not-watched.js',
            watched: false
          },
          'testfile.js'
        ],
        packages: 'custom_packages/',
        adapter: 'angular2'
      };
      client = {};
      emitter = {
        on: function() {
        }
      };
    });

    it('should add default adapter.js to the top of the files array', function() {
      initFramework(files, basePath, jspm, client, emitter);
      expect(normalPath(files[7].pattern)).toEqual(normalPath(basePath + '/src/files/default-adapter.js'));

      /**
       * karma-jspm/custom_config.js
       */
      expect(files[5].included).toEqual(true);
    });

    it('should not apply default wrapper function', function() {
      initFramework(files, basePath, jspm, client, emitter);
      expect(client.jspm.testWrapperFunctionName).toBeNull();
    });

    it('should apply a custom wrapper function', function() {
      jspm.testWrapperFunctionName = 'spec';
      initFramework(files, basePath, jspm, client, emitter);
      expect(client.jspm.testWrapperFunctionName).toEqual('spec');
    });

  });

}).call(this);
