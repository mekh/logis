const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const { Config } = require('./config');

const logger = new Logger({ storage, config: new Config() });

/**
 * Allow to change global settings
 * @param config
 * @return {Logger}
 */
logger.configure = (config) => {
  Config.configure(config);
  return logger;
};

module.exports = logger;
