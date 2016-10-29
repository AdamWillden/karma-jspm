(function(karma, System) {

  // ========================================
  // Port from karma-jspm adapter
  // See https://github.com/Workiva/karma-jspm/blob/master/src/adapter.js
  // ========================================
  console.log('default-adapter.js running');

  if (!System) {
    throw new Error("SystemJS was not found. Please make sure you have " +
      "initialized jspm via installing a dependency with jspm, " +
      "or by running 'jspm dl-loader'.");
  }

  // System.config({ baseURL: 'base' });

  var stripExtension = typeof karma.config.jspm.stripExtension === 'boolean' ? karma.config.jspm.stripExtension : true;

  // Prevent immediately starting tests.
  karma.loaded = function() {

    console.log('karma.loaded');

    // ========================================
    // kamra-jspm requirements
    // ========================================

    if (karma.config.jspm.paths !== undefined &&
      typeof karma.config.jspm.paths === 'object') {
      System.config({
        paths: karma.config.jspm.paths
      });
    }

    if (karma.config.jspm.meta !== undefined &&
      typeof karma.config.jspm.meta === 'object') {
      System.config({
        meta: karma.config.jspm.meta
      });
    }

    // Exclude bundle configurations if useBundles option is not specified
    if (!karma.config.jspm.useBundles) {
      System.bundles = [];
    }


    // hook coverage into SystemJS
    window.hookSystemJS(System, function exclude(address) {
      // files to ignore coverage
      // return !address.match(/example-app|example-tests/);
      return false;
    });

    /**
     * if preloadBySystemJS are provided
     */
    var allPreloadFiles = [];
    if (karma.config.jspm.preloadBySystemJS && karma.config.jspm.preloadBySystemJS.length) {
      console.log('Loading prerequisite files...');
      allPreloadFiles = karma.config.jspm.preloadBySystemJS
        .map(extractModuleName);
    }

    var allSpecFiles = karma.config.jspm.specFilesLoadedBySystemJS
      .filter(isSpecFile)
      .map(extractModuleName);

    // var allAppFiles = karma.config.jspm.expandedFiles
    //   .filter(notSpecFile)
    //   .map(extractModuleName);

    // Angular 2.x testing.TestBed.initTestEnvironment
    var testingBrowser;
    var testing;

    //------  LOAD SEQUENCE ------
    //------  LOAD SEQUENCE ------
    //------  LOAD SEQUENCE ------

    createPromiseChain(allPreloadFiles, 'preload')
      .then(function() {

        /**
         * If angular2 modules where loaded, set up angular2 testing
         */
        if (testing && testingBrowser) {

          console.log('\n\nAngular 2.0 TestBed.initTestEnvironment.\n\n');

          testing.TestBed.initTestEnvironment(testingBrowser.BrowserDynamicTestingModule,
            testingBrowser.platformBrowserDynamicTesting());

        }

        return Promise.resolve();

      })
      // .then(function() {
      //   return createPromiseChain(allAppFiles, 'app');
      // })
      .then(function() {
        return createPromiseChain(allSpecFiles, 'spec');
      })
      .then(function() {

        if (window.__coverage__) {
          window.__coverage__._originalSources = _originalSources;
        }

        // Next
        console.log('karma.start');

        return Promise.resolve();
      })
      .then(karma.start, karma.error);

    //------  HELPER FUNCTIONS ------
    //------  HELPER FUNCTIONS ------
    //------  HELPER FUNCTIONS ------

    function isSpecRegex(path) {
      return /.*?(\.[sS][pP][eE][cC]).[jtJT][sS]/.test(path);
    }

    function isTestRegex(path) {
      return /.*?(\.[tT][eE][sS][tT]).[jtJT][sS]/.test(path);
    }

    function isSpecFile(path) {
      return isSpecRegex(path) || isTestRegex(path);
    }

    // function notSpecFile(path) {
    //   return !isSpecRegex(path) && !isTestRegex(path);
    // }

    function SystemImportPreload(moduleName) {
      return System['import'](moduleName).then(function(module) {

        // console.log('Prerequisite module loaded: ' + moduleName);

        if (module.hasOwnProperty('platformBrowserDynamicTesting') || module.hasOwnProperty('BrowserDynamicTestingModule')) {
          testingBrowser = module;
        }

        if (module.hasOwnProperty('TestBed')) {
          testing = module;
        }

      }, function(err) {

        console.log(err);
        console.log('\n\nSystemJS Error loading ' +
          'prerequisite module: ' + moduleName +
          '. \nYou may need to install with ' +
          'jspm or configure in your systemjs config\n\n');

      });
    }

    // function SystemImportApp(moduleName) {
    //   return System['import'](moduleName);
    // }

    function SystemImportSpecs(moduleName) {
      return System['import'](moduleName).then(function(module) {

          var wrapperFN = karma.config.jspm.testWrapperFunctionName;

          // if (/[\.|_]spec\.ts$/.test(moduleName) || /[\.|_]spec\.js$/.test(moduleName)) {
          if (module.hasOwnProperty(wrapperFN)) {
            if (wrapperFN && wrapperFN.length) {

              /**
               * Test files have a wrapper method around their describe blocks.
               * Trigger tests by calling the wrapper method.
               */
              module[wrapperFN]();
            }
          }

          var successMsg = 'Loaded: ' + moduleName;

          console.log(successMsg);


        },
        function(err) {

          console.log(JSON.stringify(err, null, 2));

          var errMsg = 'SystemJS Error loading module: ' + moduleName;

          console.log(errMsg);

        })
    }

    function createPromiseChain(filesArray, importType) {
      var promiseChain = Promise.resolve();

      for (var i = 0; i < filesArray.length; i++) {
        promiseChain = promiseChain.then((function(moduleName) {
          return function() {

            if (importType == 'preload') {
              return SystemImportPreload(moduleName);
            }

            // if (importType == 'app') {
            //   return SystemImportApp(moduleName);
            // }

            if (importType == 'spec') {
              return SystemImportSpecs(moduleName);
            }

          };
        })(filesArray[i]))
          .catch(function(err) {
            console.log(err);
            console.log('Promise Error for module ' + filesArray[i]);
          });
      }

      return promiseChain;
    }

    function extractModuleName(fileName) {

      if (karma.config.jspm.prefix) {
        // fileName = karma.config.jspm.prefix + fileName;
      }

      if (stripExtension) {
        return fileName.replace(/\.js$/, "");
      }
      return fileName;
    }
  }
})(window.__karma__, window.SystemJS);
