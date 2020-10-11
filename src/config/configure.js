const config = require('./config');
const errors = require('../common/errors');
const { levels } = require('../common/levels');
const { format: formatter } = require('../logger/format');

/**
 * Set the default configuration for all loggers
 * @param {string} loglevel - default loglevel
 * @param {boolean} colorize - whether to colorize the output or not
 * @param {function} format - default formatter
 * @return {Logger}
 */
const configure = ({ loglevel, colorize = false, format = formatter } = {}) => {
  if (loglevel && !Object.keys(levels).includes(loglevel.toLowerCase())) {
    throw errors.invalidLogLevel;
  }

  if (typeof colorize !== 'boolean') {
    throw errors.invalidTypeBool;
  }

  config.defaultLogLevel = loglevel;
  config.useColors = colorize;
  config.format = format;
};

module.exports = configure;
