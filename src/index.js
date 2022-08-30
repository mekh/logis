/**
 * @typedef ConfigParams
 * @property {boolean} [json]
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {function(*): *} [format]
 * @property {object} [logline]
 * @property {object} [primitives]
 */

const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const { Config } = require('./config');
const { defaults, Primitives, Logline } = require('./formatter');

const logger = new Logger({ storage, config: new Config() });

/**
 * Allow to change global settings
 * @param {ConfigParams} [config]
 * @return {Logger}
 */
logger.configure = (config = {}) => {
  Config.setGlobalConfig({ ...defaults, ...config });
  logger.config = new Config();

  return logger;
};

module.exports = {
  logger,
  ...defaults,
  Primitives,
  Logline,
};
