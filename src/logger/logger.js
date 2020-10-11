const serialize = require('../utils/serialize');
const errors = require('../common/errors');
const { config } = require('../config');
const { colors } = require('../common/levels');
const { assertLogLevel, isValidLevel } = require('./loglevel');
const { levels, logLevels } = require('../common/levels');

/**
 * Logger
 */
class Logger {
  /**
   * Constructor
   * @param {string} [category] - category name
   * @param {string} [loglevel] - logging level
   */
  constructor(category = '', loglevel) {
    this.category = category;
    this.levels = logLevels;
    this.loglevel = loglevel;
    this.useColors = null;

    this.format = config.format;

    assertLogLevel(this.level);
  }

  /**
   * The the log level
   * @return {string}
   */
  get level() {
    return (this.loglevel || config.defaultLogLevel).toLowerCase();
  }

  /**
   * Set the log level
   * @param {string} loglevel
   */
  set level(loglevel) {
    assertLogLevel(loglevel);
    this.loglevel = loglevel.toLowerCase();
  }

  /**
   * Colorize getter
   * @return {boolean}
   */
  get colorize() {
    return this.useColors !== null ? this.useColors : config.useColors;
  }

  /**
   * Colorize setter
   * @param {boolean} value
   */
  set colorize(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    this.useColors = value;
  }

  /**
   * Return true if message level is less or equal to the logger's one
   * @param {string} loglevel - message log level
   * @return {boolean}
   */
  shouldLog(loglevel) {
    const messageLevel = this.levels[loglevel.toLowerCase()];
    const loggerLevel = this.levels[this.level];

    return loggerLevel >= messageLevel;
  }

  /**
   * Print out a message
   * @param {string} level
   * @param {any} args
   */
  log(level, ...args) {
    const isValid = isValidLevel(level);
    if (isValid && !this.shouldLog(level)) {
      return;
    }

    if (!isValid) {
      args.unshift(level);
    }

    const message = args.map(serialize).join(' ');
    const text = this.format({ message, level, logger: this });
    const output = this.colorize && isValidLevel(level) ? colors[level](text) : text;

    console.log(output);
  }

  /**
   * Log an error message
   * @param {any} args
   */
  error(...args) {
    this.log.call(this, levels.error, ...args);
  }

  /**
   * Log a warning message
   * @param {any} args
   */
  warn(...args) {
    this.log.call(this, levels.warn, ...args);
  }

  /**
   * Log an info message
   * @param {any} args
   */
  info(...args) {
    this.log.call(this, levels.info, ...args);
  }

  /**
   * Log a debug message
   * @param {any} args
   */
  debug(...args) {
    this.log.call(this, levels.debug, ...args);
  }

  /**
   * Log a trace message
   * @param {any} args
   */
  trace(...args) {
    this.log.call(this, levels.trace, ...args);
  }
}

module.exports = Logger;
