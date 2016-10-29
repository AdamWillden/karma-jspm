module.exports = {
  hasValue: hasValue,
  isJSExt: isJSExt,
  isTSExt: isTSExt,
  isSpecRegex: isSpecRegex,
  isTestRegex: isTestRegex
};

function hasValue(value) {
  return value !== undefined && value !== null;
}

function regexExt(path) {
  // var regex = new RegExp(/\.[0-9a-z]+$/, 'i');
  return path.match(/\.[0-9a-z]+$/i);
}

function isJSExt(path) {
  return regexExt(path) && regexExt(path)[0] === '.js';
}

function isTSExt(path) {
  return regexExt(path) && regexExt(path)[0] === '.ts';
}

function isSpecRegex(path) {
  return /.*?(\.[sS][pP][eE][cC]).[jJtT][sS]/.test(path);
}

function isTestRegex(path) {
  return /.*?(\.[tT][eE][sS][tT]).[jJtT][sS]/.test(path);
}
