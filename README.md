# karma-jspm  

[![Build Status](https://travis-ci.org/UIUXEngineering/karma-jspm.svg?branch=master)](https://travis-ci.org/UIUXEngineering/karma-jspm)
[![Build status](https://ci.appveyor.com/api/projects/status/7tub3wa7m998h5xu/branch/master?svg=true)](https://ci.appveyor.com/project/jerryorta-dev/karma-jspm/branch/master)
[![Join the chat at https://gitter.im/UIUXEngineering/karma-jspm](https://badges.gitter.im/UIUXEngineering/karma-jspm.svg)](https://gitter.im/UIUXEngineering/karma-jspm?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


**This plugin can now support angular 2.1.1 and JSPM 0.29 beta**

See this [Test Repo](https://github.com/UIUXEngineering/karma-jspm-test) for configurations and examples.

This plugin is originally a fork of [Workiva/karma-jspm](https://github.com/Workiva/karma-jspm). 
Among the additional features, this version utilizes SystemJS to load, 
transpile, run your tests, and to generate code coverage. Special configurations
allow for angular2 testing.

There is no need to preprocess ( pre-transpile ) your code before 
running tests or to generate a coverage report. Your report may be
remapped to the original TypeScript or ES6 source code.

See a sample implementation of this plugin at [angular2-jspm-typescript-seed](https://github.com/UIUXEngineering/angular2-jspm-typescript-seed).

You may use this [Test Repo](https://github.com/UIUXEngineering/karma-jspm-test) to see sample configurations, test scenarios, 
or to submit a PR to demo bugs. The [Test Repo](https://github.com/UIUXEngineering/karma-jspm-test) is used for Mac and PC 
testing.

##Installation

Available in npm: `npm install karma-uiuxengineering-jspm --save-dev`

**This plugin assumes you are using jspm in your project.** You will 
need to have a `config.js` in the root of your project (though this 
is configurable) as well as a `jspm_packages` directory containing 
systemjs and the es6-module-loader.


##Configuration##
For simple architectures, minimal configuration is needed.

*karma.conf.js*

Include this plugin in your frameworks:

```js
frameworks: ['jspm', 'jasmine'],
```

If you want to register the plugin with karma ( [not required](http://karma-runner.github.io/1.0/config/plugins.html) ):

```js
plugins: [
      'karma-uiuxengineering-jspm',
      'karma-jasmine',
      'karma-chrome-launcher'
    ]
```

Set ```basePath``` of your karma config to the the directory where
you will serve the development of your app.
```js
config.set({
    
    basePath: './',
    
    jspm: {
        // Edit this to your needs
        loadFiles: ['src/**/*.js', 'test/**/*.js']
    }
}
```

####loadFiles *DEPRECATED*  
Use [files](#files) below.
LoadFiles and serverFiles properties were used to distinguish with patterns
karma should use to load files into the browser. SystemJS loads all app and 
test files in the browser, so there is only one karma pattern that works.

This pattern is configured by default with the ```files``` property.

In case you are wondering, this is the pattern:

```js

    {
        pattern: 'relative/path/file.ts',
    
        // Not using <script> tags to load files, systemjs is loading them.
        included: false,
    
        // Karma is serving the file
        served: true,
    
        // Not serving from the file system, serving from karma server
        nocache: false,
    
        // Re-test if file changes
        watched: true
      }
```

####serveFiles *DEPRECATED*  
Use [files](#files) below.

See [loadFiles](#loadFiles) above for deprecation explanation.

####files 
Required  
**Default**: *undefined*

The ```jspm.files``` configuration tells karma-jspm which files should 
be dynamically loaded via systemjs.

[glob 7.x](https://www.npmjs.com/package/glob) is supported.

**You should not include these in the regular karma files array.** 
karma-jspm takes care of this for you by adding them with the correct
karma object configuration. 

```js
config.set({
    
    basePath: './src/browser',
    
    jspm: {
        // glob 7.x patterns supported 
        files: ['app/**/!(*.e2e-spec).ts']
    }
}
```

For more complex architectures, additional configurations may be necessary.


###JSPM 0.17 Beta Config files - Notes
Config files are loaded in this following order, regardless of which file may be excluded:

browserConfig, devConfig, nodeConfig, jspmConfig

browserConfig is first because it normally contains "baseURL", which SystemJS 
throws an error if it is not in the first config called.

jspmConfig is last because it normally contains mapping, packages, and transpiler information.

As you will see in the [Test Repo](https://github.com/UIUXEngineering/karma-jspm-test) there are two transpilers. 
The default ( primary ) is the one which is assinged to the ```transpiler``` property ( babel in the test repo ). 
 The additional (secodndary) just has configuration options ( TypeScript in the [Test Repo](https://github.com/UIUXEngineering/karma-jspm-test) ). In my expirements the secondary MUST be 
in the same file/config which the package is defined to use it as a loader.

####browserConfig
*JSPM 0.17 Beta*  
Optional  
**Default**: *undefined*

For JSPM 0.17 Beta, you can to specify `jspm.browser.js`.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        // relative to basePath in karma config
        browserConfig: "path/to/myJspmBrowser.js"
    }
}    
```

####devConfig
*JSPM 0.17 Beta*  
Optional  
**Default**: *undefined*

For JSPM 0.17 Beta, you can to specify `jspm.dev.js`.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        // relative to basePath in karma config
        devConfig: "path/to/myJspmDev.js"
    }
}    
```

####nodeConfig
*JSPM 0.17 Beta*  
Optional  
**Default**: *undefined*

For JSPM 0.17 Beta, you can to specify `jspm.node.js` file.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        // relative to basePath in karma config
        nodeConfig: "path/to/myJsonNode.js" 
    }
}    
```

####config *DEPRECATED*  
Use ```jspmConfig````.

```config``` has been deprecated to align with jspm 0.l7 naming conventions.
By default jspm names the base config ```jspm.config.js```.

####jspmConfig
Optional  
**Default**: *parsed from package.json*

You may have named your jspm `config.js`. The package.json configuration
for jspm beta may change; if you have issues, provide the path to 
your config file.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        // relative to basePath in karma config
        config: "path/to/myJspmConfig.js"
    }
}    
```


####packages
Optional  
**Default**: *parsed from package.json*

You may have named your `jspm_packages` directory to something else. 
The package.json configuration for jspm beta may change; if you have 
issues, provide the path to your packages directory.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        // relative to basePath in karma config
        packages: "path/to/my_jspm_modules/"
    }
}    
```

####useBundles
Optional  
**Default**: *false*

By default karma-jspm ignores jspm's bundles configuration. To re-enable 
it, specify the `useBundles` option.

```js
config.set({

    basePath: './src/client',
    
    jspm: {
        useBundles: true
    }
}
```


####paths
Optional  
**Default**: *undefined*

Depending on your framework and project structure it might be necessary 
to override jspm paths for the testing scenario.In order to do so just 
add the `paths` property to the jspm config object in your 
karma-configuration file, along with the overrides:

```js
jspm: {
    paths: {
        '*': 'yourpath/*.js',
        ...
    }
}
```


####stripExtension
Optional  
**Default**: *undefined*

By default the plugin will strip the file extension of the js files. 
To disable that, specify the `stripExtension` option:

```js
jspm: {
    stripExtension: false
}
```

####cachePackages
Optional  
**Default**: *undefined*

Most of the time, you do not want to cache your entire jspm_packages 
directory, but serve it from the disk. This is done by default, but 
can be reversed as follows:

```js
jspm: {
    cachePackages: true
}
```

####adapter
Optional  
**Default**: *undefined*

By default, an adapter implementing ```karma.start()``` is provided to 
launch unit tests. Other plugins may override ```karma.start``` causing
issues with this plugin. You may use a custom adapter to resolve these
issues. See the provided [default adapter](https://github.com/UIUXEngineering/karma-jspm/blob/master/src/files/default-adapter.js#L151) for an example implementation:

```js
jspm: {
    adapter: 'youradapter.js'
}
```

####testWrapperFunction
Optional  
**Default**: *undefined*

Some test implementations require the tests ( describe blocks ) to be 
wrapped in a function. Set the name of the wrapper function.

```js
jspm: {
    testWrapperFunction: 'main'
}
```

####preloadBySystemJS
Optional  
**Default**: *undefined*

SystemJS loads files from the ```jspm_packages``` directory ( or your 
named directory ) by concatenating the file and version number that 
is mapped in the jspm.config.js file. So loading af file with SystemJS 
with the path string "zone.js/dist/zone.js" would actually load with 
the path similar to "jspm_packages/npm/zone.js@0.6.12/dist/zone.js". 

You can use SystemJS to pre-load files before tests are run the same 
as you would in your app, rather than using karma to load the files by 
manually configure the paths.

Provide an array of path strings that are the same as you would import 
them in your app. They will load in same order as your array.

see [Angular 2.0 related files pre-loaded](https://github.com/UIUXEngineering/karma-jspm/blob/master/src/preloadFiles/angular2-preload-files.js).

```js
jspm: {
    preloadBySystemJS: [
                         // Polyfills
                         'es6-shim',
                         'core-js/client/shim.min.js',
                         'reflect-metadata/Reflect.js',
                       
                         // Test Assistance
                         'zone.js/dist/zone.js',
                         'zone.js/dist/long-stack-trace-zone.js',
                         'zone.js/dist/async-test.js',
                         'zone.js/dist/fake-async-test.js',
                         'zone.js/dist/sync-test.js',
                         'zone.js/dist/proxy.js',
                         'zone.js/dist/jasmine-patch.js',
                       
                         // TestBed.initTestEnvironment
                         '@angular/core/testing',
                         '@angular/platform-browser-dynamic/testing'
                       ]
}
```

###Code Coverage
A coverage Instrumenter is provided with a SystemJS hook in the browser 
using @guybedford's example from his [blog](http://guybedford.com/systemjs-mocha-istanbul). Similar
to the karma-coverage plugin, you set the preprocessor to 'jspm'. This 
does NOT transpile files, but only selects which files to include in your 
coverage report.

```js
preprocessors: {
    'app/**/!(*.spec).ts': ['jspm']
},
```

The reporter works the same as other karma reporters.
```js
reporters: ['jspm']
```

####remap
Optional  
**Default**: *false*

Configure the output of the reports using coverageReporter property. Set
```remap``` to true to map the coverage reports to the original typescript 
or es6 files.

```js
coverageReporter: {
      
      // map coverage to source typescript or es6 files.
      remap: true, 
      
      dir: process.cwd() + '/coverage',
      
      reporters: [

        // will generate html report
        {type: 'html'},

        // will generate json report file and this report is loaded to 
        // make sure failed coverage cause gulp to exit non-zero
        {type: 'json', file: 'coverage-final.json'},

        // will generate Icov report file and this report is published to coveralls
        {type: 'lcov'},

        // it does not generate any file but it will print coverage to console
        // a summary of the coverage
        // {type: 'text-summary'}, 

        // it does not generate any file but it will print coverage to console
        // a detail report of every file
        {type: 'text'}
      ]
    }
```

###Angular2 Configurations

####adapter
Required  
**Set to**: *'angular2'*

If you are using angular2, specify 'angular2' as your adapter, and an a 
adapter specific to angular2 tests will be used.


```js
jspm: {
    adapter: 'angular2'
}
```

####testWrapperFunctionName
Optional  
**Default**: *'main'*

Angular2 tests may implement a wrapper function. By default, the 
wrapper function is ```main()```. You can override this with 
either another function name for an empty string if a wrapper 
function is not desired.

```js
jspm: {
    testWrapperFunctionName: 'nameOfFunction'
}
```

####preloadBySystemJS
Optional  
**Default**: *see below*

For Angular2 testing, SystemJS will automatically pre-load the following 
files before tests are run, so they are ot necessary to load in the karma 
config.

```js

[
  // Polyfills
  'es6-shim',
  'core-js/client/shim.min.js',
  'reflect-metadata/Reflect.js',

  // Test Assistance
  'zone.js/dist/zone.js',
  'zone.js/dist/long-stack-trace-zone.js',
  'zone.js/dist/async-test.js',
  'zone.js/dist/fake-async-test.js',
  'zone.js/dist/sync-test.js',
  'zone.js/dist/proxy.js',
  'zone.js/dist/jasmine-patch.js',

  // TestBed.initTestEnvironment
  '@angular/core/testing',
  '@angular/platform-browser-dynamic/testing'
]
```
             
If you want to change the pre-load file list above, you may override 
with the ```preloadBySystemJS``` config.

```js
jspm: {
    preloadBySystemJS: [ 'fileA.js', 'fileB.js']
}
```
