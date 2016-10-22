var path = require('path');

module.exports = {
  normalize: normalize,
  flatten: flatten
};

function normalize() {

  // not doing anything with ...args
  return path.join.apply(null, Array.prototype.slice.call(arguments));
}

function flatten(structure) {
  return [].concat.apply([], structure);
}
