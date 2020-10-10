const config = require('../config');
const serialize = require('../utils/serialize');
const errors = require('../common/errors');
const { levels, logLevels, colors } = require('../common/levels');

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

    this.assertLogLevel(this.level);
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
    this.assertLogLevel(loglevel);
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
   * Check if a log level exists in the levels list
   * @param loglevel
   * @return {boolean}
   */
  hasLevel(loglevel) {
    return Object.keys(this.levels).includes(loglevel.toLowerCase());
  }

  /**
   * Check if a given log level is valid
   * @param {string} loglevel
   * @return {boolean}
   */
  isValidLevel(loglevel) {
    return typeof loglevel === 'string' && this.hasLevel(loglevel);
  }

  /**
   * Check if a log level is valid, throw TypeError if it isn't
   * @param {string} loglevel
   */
  assertLogLevel(loglevel) {
    if (!this.isValidLevel(loglevel)) {
      throw errors.invalidLogLevel;
    }
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
   * Build a log prefix
   * @param {string} loglevel
   * @return {string}
   */
  buildPrefix(loglevel) {
    const timestamp = `[${new Date().toISOString()}]`;
    const logLevel = this.isValidLevel(loglevel) ? `[${loglevel.toUpperCase()}]` : '';
    const pid = process.pid ? `[${process.pid}]` : '';
    const category = this.category ? `[${this.category}]` : '';

    return [timestamp, logLevel, pid, category].filter(Boolean).join(' ');
  }

  /**
   * Format a message
   * @param {string} message
   * @param {string} loglevel
   * @return {*|string}
   */
  format(message, loglevel) {
    const prefix = this.buildPrefix(loglevel);
    const text = `${prefix} ${message}`;

    return this.colorize && this.isValidLevel(loglevel) ? colors[loglevel](text) : text;
  }

  /**
   * Print out a message
   * @param {string} level
   * @param {any} args
   */
  log(level, ...args) {
    const isValidLevel = this.isValidLevel(level);
    if (isValidLevel && !this.shouldLog(level)) {
      return;
    }

    if (!isValidLevel) {
      args.unshift(level);
    }

    const message = args.map(serialize).join(' ');
    const text = this.format(message, level);

    console.log(text);
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
