var path = require('path');
var _ = require('lodash');

function getRelativePathToBase(basePath, relativePath) {

  var basePathArray = basePath.split(path.sep);
  var configPathArray = relativePath.split(path.sep);

  if (_.last(basePathArray) === '') {
    basePathArray = _.initial(basePathArray);
  }

  var configRelativePathArray = [];

  _.forEachRight( _.clone(configPathArray), function(lastItem) {
    if (lastItem === _.last(basePathArray)) {
      basePathArray = _.initial(basePathArray);
      configPathArray = _.initial(configPathArray);
    } else {
      configRelativePathArray.unshift(lastItem);
    }
  });

  var finalPath = '';
  if (configRelativePathArray.length) {
    finalPath = _.join(configRelativePathArray, path.sep);
  }

  return finalPath;

}

module.exports = {
  getRelativePathToBase   : getRelativePathToBase
};
