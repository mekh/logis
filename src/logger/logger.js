const errors = require('../common/errors');
const { config } = require('../config');
const { colors } = require('../common/levels');
const { assertLogLevel, isValidLevel } = require('./loglevel');
const { levels, logLevels } = require('../common/levels');

/**
 * @class Logger
 */
class Logger {
  /**
   * @constructor
   * @param {string} [category] - category name
   * @param {logLevelString} [loglevel] - logging level
   */
  constructor(category = '', loglevel) {
    this.category = category;
    this.levels = logLevels;
    this.loglevel = loglevel;
    this.useColors = null;

    this.format = config.format;
    this.useTimestamp = config.timestamp;

    assertLogLevel(this.level);

    this.setupLoggers();
  }

  /**
   * The the log level
   * @return {logLevelString}
   */
  get level() {
    return (this.loglevel || config.defaultLogLevel).toLowerCase();
  }

  /**
   * Set the log level
   * @param {logLevelString} loglevel
   * @return {void}
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
   * @return {void}
   */
  set colorize(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    this.useColors = value;
  }

  /**
   * Get the timestamp setting
   * @returns {boolean}
   */
  get timestamp() {
    return this.useTimestamp;
  }

  /**
   * Set false to remove the timestamp from the log output
   * @param {boolean} value
   */
  set timestamp(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    this.useTimestamp = value;
  }

  /**
   * Setup per-level loggers
   * @private
   */
  setupLoggers() {
    this.error = this.log.bind(this, levels.error);
    this.warn = this.log.bind(this, levels.warn);
    this.info = this.log.bind(this, levels.info);
    this.debug = this.log.bind(this, levels.debug);
    this.trace = this.log.bind(this, levels.trace);
  }

  /**
   * Return true if message level is less or equal to the logger's one
   * @param {logLevelString} loglevel - message log level
   * @return {boolean}
   * @private
   */
  shouldLog(loglevel) {
    assertLogLevel(loglevel);

    const messageLevel = this.levels[loglevel.toLowerCase()];
    const loggerLevel = this.levels[this.level];

    return loggerLevel >= messageLevel;
  }

  /**
   * Print out a message
   * @param {logLevelString|any} [level]
   * @param {any[]} args
   * @return {void}
   * @private
   */
  log(level, ...args) {
    const isValid = isValidLevel(level);
    if (isValid && !this.shouldLog(level)) {
      return;
    }

    if (!isValid) {
      args.unshift(level);
    }

    const text = this.format({ args, level, logger: this });
    const output = this.colorize && isValidLevel(level) ? colors[level.toLowerCase()](text) : text;

    console.log(output);
  }
}

module.exports = Logger;
