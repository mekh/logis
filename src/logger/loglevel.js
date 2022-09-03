const { logLevels } = require('../common/levels');
const errors = require('../common/errors');

/**
 * Check if a log level exists in the levels list
 * @param {string} loglevel
 * @return {boolean}
 */
const hasLevel = (loglevel = '') => Object.keys(logLevels).includes(loglevel.toLowerCase());

/**
 * Check if a given log level is valid
 * @param {string} loglevel
 * @return {boolean}
 */
const isValidLevel = loglevel => typeof loglevel === 'string' && hasLevel(loglevel);

/**
 * Check if a log level is valid, throw TypeError if it isn't
 * @param {string} loglevel
 */
const assertLogLevel = loglevel => {
  if (!isValidLevel(loglevel)) {
    throw errors.invalidLogLevel;
  }
};

module.exports = {
  hasLevel,
  isValidLevel,
  assertLogLevel,
};
