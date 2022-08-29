/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {function(*): *} [format]
 * @property {boolean} [timestamp]
 * @property {object} [logline]
 * @property {object} [primitives]
 */

const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const { Config } = require('./config');
const { defaults } = require('./formatter');

const logger = new Logger({ storage, config: new Config() });

/**
 * Allow to change global settings
 * @param {ConfigParams} [config]
 * @return {Logger}
 */
logger.configure = (config = {}) => {
  Config.configure({ ...defaults, ...config });
  return logger;
};

module.exports = logger;
