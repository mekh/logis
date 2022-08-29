const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const { Config } = require('./config');

const getLogger = (category) => {
  const stored = storage.getLogger(category);
  if (stored) {
    return stored;
  }

  const logger = new Logger(category, new Config());
  logger.getLogger = getLogger;
  if (category) {
    storage.addLogger(category, logger);
  }

  return logger;
};

/**
 * Get stored or a new logger
 * @return {Logger}
 */
const init = () => {
  const initialLogger = new Logger(undefined, new Config());

  initialLogger.getLogger = getLogger;
  initialLogger.configure = (config) => {
    Config.configure(config);
    return initialLogger;
  };

  return initialLogger;
};

module.exports = init();
