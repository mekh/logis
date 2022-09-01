const errors = require('../common/errors');
const { DEFAULT_STORAGE_LIMIT } = require('../constants');

const loggers = [];

/**
 * Find logger
 * @param {string} category - category name
 * @return {Logger|undefined}
 */
const findLogger = category => loggers.find(logger => logger.category === category);

/**
 * Get an existing logger
 * @param {string} [category] - category name
 * @return {Logger|null}
 */
const getLogger = (category) => {
  if (!category) {
    return null;
  }

  return findLogger(category);
};

/**
 * Add a new logger
 * @param {string} category - category name
 * @param {object} logger - logger instance
 * @return {void}
 */
const addLogger = (category, logger) => {
  if (!['symbol', 'string'].includes(typeof category)) {
    throw errors.invalidCategory;
  }

  if (findLogger(category)) {
    return;
  }

  if (loggers.length >= DEFAULT_STORAGE_LIMIT) {
    loggers.shift();
  }

  loggers.push(logger);
};

module.exports = {
  getLogger,
  addLogger,
};
