/**
 * @typedef ConfigParams
 * @property {boolean} [json]
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {function(*): *} [format]
 * @property {object} [logline]
 * @property {object} [primitives]
 */

const { Logger } = require('./logger/logger');
const { LoggerStorage } = require('./logger/storage');
const { Config } = require('./config');
const { defaults, Primitives, Logline } = require('./formatter');

const { DEFAULT_STORAGE_LIMIT } = require('./constants');

const storage = new LoggerStorage({ limit: DEFAULT_STORAGE_LIMIT });
const logger = new Logger({ storage, config: new Config() });

/**
 * @type {{Logline: Logline, Primitives: Primitives}}
 */
logger.formatters = {
  Primitives,
  Logline,
};

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

module.exports = logger;
