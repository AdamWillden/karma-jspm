(function() {

  var cwd = process.cwd();
  var path = require('path');
  var initFramework = require('../src/framework');

  var normalPath = function(path) {
    return path.replace(/\\/g, '/');
  };

  describe('angular2 adapter', function() {
    var files, jspm, client, emitter;
    var basePath = path.resolve(__dirname, '..');
    var angular2JspmPattern = normalPath(basePath + '/src/files/default-adapter.js');

    beforeEach(function() {
      files = [];
      jspm = {
        browserConfig: 'custom_browser.js',
        config: 'custom_config.js',
        loadFiles: ['src/**/*.js', {
          pattern: 'not-cached.js',
          nocache: true
        }, {pattern: 'not-watched.js', watched: false}],
        packages: 'custom_packages/',
        serveFiles: ['testfile.js'],
        adapter: 'angular2',
        preloadBySystemJS: null
      };
      client = {};
      emitter = {
        on: function() {
        }
      };
    });

    describe('adapter = angular2', function() {

      it('should set pattern', function() {
        initFramework(files, basePath, jspm, client, emitter);
        expect(normalPath(files[7].pattern)).toEqual(angular2JspmPattern);
      });

      it('should add predefined angular2 modules to preloadBySystemJS', function() {
        var angular2PreloadFiles = require('../src/preloadFiles/angular2-preload-files');

        initFramework(files, basePath, jspm, client, emitter);

        expect(client.jspm.preloadBySystemJS).toEqual(angular2PreloadFiles);
      });

      it('should add modules from preloadBySystemJS in karma config', function() {
        var angular2PreloadFiles = require('../src/preloadFiles/angular2-preload-files');

        jspm.preloadBySystemJS = ['foo', 'bar'];

        angular2PreloadFiles = angular2PreloadFiles.concat(jspm.preloadBySystemJS);

        initFramework(files, basePath, jspm, client, emitter);

        expect(client.jspm.preloadBySystemJS).toEqual(angular2PreloadFiles);
      });

    });

    describe('adapter != angular2', function() {

      it('should create an empty array if adapter and preloadBySystemJS not set', function() {
        delete jspm.adapter;

        initFramework(files, basePath, jspm, client, emitter);

        expect(client.jspm.preloadBySystemJS.length).toEqual(0);
      });

      it('should use preloadBySystemJS modules if angular2 is not set', function() {
        delete jspm.adapter;

        jspm.preloadBySystemJS = ['foo', 'bar'];

        initFramework(files, basePath, jspm, client, emitter);

        expect(client.jspm.preloadBySystemJS).toEqual(jspm.preloadBySystemJS);
      });

    });

  });

}).call(this);
