const { config } = require('./config');
const { format: formatter } = require('../logger/format');

/**
 * Set the default configuration for all loggers
 * @param {logLevelString} loglevel - default loglevel
 * @param {boolean} colorize - whether to colorize the output or not
 * @param {function({args: any[], logger?: Logger, level?: logLevelString}): string} format - default formatter
 * @return {Logger}
 */
const configure = ({ loglevel, colorize = false, format = formatter } = {}) => {
  config.defaultLogLevel = loglevel;
  config.useColors = colorize;
  config.format = format;
};

module.exports = configure;
