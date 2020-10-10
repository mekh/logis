const errors = require('../common/errors');

const loggers = {};

/**
 * Get an existing logger
 * @param {string} [category] - category name
 * @return {Logger|null}
 */
const getLogger = (category) => {
  if (!category) {
    return null;
  }

  return loggers[category];
};

/**
 * Get an existing logger
 * @param {string} category - category name
 * @param {object} logger - logger instance
 * @return {void}
 */
const addLogger = (category, logger) => {
  if (!['symbol', 'string'].includes(typeof category)) {
    throw errors.invalidCategory;
  }

  if (loggers[category]) {
    return;
  }

  loggers[category] = logger;
};

module.exports = {
  getLogger,
  addLogger,
};
