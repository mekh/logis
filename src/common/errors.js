const { levels } = require('./levels');

/**
 * Common errors
 * @type {{invalidLogLevel: TypeError, invalidCategory: TypeError, invalidTypeBool: TypeError}}
 */
module.exports = {
  invalidLogLevel: new TypeError(`Invalid loglevel, valid levels are: ${Object.keys(levels).join(', ')}.`),
  invalidCategory: new TypeError('The category name must be a non-empty string or a Symbol'),
  invalidTypeBool: new TypeError('The value must be a boolean'),
  invalidTypeFn: new TypeError('The value must be a function'),
};
