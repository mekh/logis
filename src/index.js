const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const { configure } = require('./config');

/**
 * Change the global configuration
 * @param {Logger} logger
 * @param {object} options
 * @return {Logger}
 */
const config = (logger, options) => {
  configure(options);
  return logger;
};

/**
 * Get stored or a new logger
 * @param {string} [category]
 * @return {Logger}
 */
const getLogger = (category) => {
  const stored = storage.getLogger(category);
  if (stored) {
    return stored;
  }

  const newLogger = new Logger(category);
  newLogger.getLogger = getLogger;
  newLogger.configure = config.bind(null, newLogger);

  if (category) {
    storage.addLogger(category, newLogger);
  }

  return newLogger;
};

module.exports = getLogger();
