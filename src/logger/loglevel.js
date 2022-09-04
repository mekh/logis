const { DEFAULT_LOG_LEVELS } = require('../constants');

class Loglevel {
  static defaults = DEFAULT_LOG_LEVELS;

  static create(config) {
    return new Loglevel(config);
  }

  static assert(loglevel) {
    return Loglevel.create().assertLevel(loglevel);
  }

  /**
   * @param {string[]} [levels]
   */
  constructor({ levels = DEFAULT_LOG_LEVELS } = {}) {
    this.levels = levels;
  }

  /**
   * Returns a number representation of a logLevel severity
   * @param {string} loglevel
   * @return {number}
   */
  severity(loglevel) {
    this.assertLevel(loglevel);

    return this.levels.indexOf(loglevel.toLowerCase());
  }

  /**
   * Check if a log level exists in the levels list
   * @param {string} [loglevel]
   * @return {boolean}
   */
  isValid(loglevel) {
    return typeof loglevel === 'string'
      ? this.levels.includes(loglevel.toLowerCase())
      : false;
  }

  /**
   * Check if a log level is valid, throw TypeError if it isn't
   * @param {string} loglevel
   */
  assertLevel(loglevel) {
    if (this.isValid(loglevel)) {
      return;
    }

    throw new TypeError(`Invalid loglevel, valid levels are: ${this.levels.join(', ')}`);
  }
}

module.exports = {
  Loglevel,
};
