# The NPM module of this plugin has moved to [karma-uiuxengineering-jspm](https://www.npmjs.com/package/karma-uiuxengineering-jspm)


See issue [for andular2 seed](https://github.com/UIUXEngineering/angular2-jspm-typescript-seed/issues/2) and [karma-jspm](https://github.com/UIUXEngineering/karma-jspm/issues/3)

On PC's, there is an issue with loading plugins using  ```require```:


```javascript

plugins: [
      require('@uiuxengineering/karma-jspm')
    ]

```

It is better to adhere to karma standards to fix this issue and to allow
developers to not have to configure plugins. Karma looks for the ```karma-*``` 
prefix in the node_modules directory so a config is not required.

To install this plugin from the new NPM package:

```bash

npm install karma-uiuxengineering-jspm --save-dev


```

and the plugin can now be configured as 

```javascript

plugins: [
      'karma-uiuxengineering-jspm'
    ]

```

or not configured at all.
