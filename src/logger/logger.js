/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {function(*): *} [format]
 * @property {boolean} [timestamp]
 */

const { colors } = require('../common/levels');
const { assertLogLevel, isValidLevel } = require('./loglevel');
const { levels, logLevels } = require('../common/levels');
const { Parser, defaults } = require('../formatter');
const { Message } = require('./message');
const { Config } = require('../config');
const callsites = require('../utils/callsite');

/**
 * @class Logger
 */
class Logger {
  /**
   * @constructor
   * @param {string} [category] - category name
   * @param {object} config - logging level
   * @param storage
   * @param logline
   * @param primitives
   */
  constructor({
    category,
    config,
    storage,
    logline = defaults.logline,
    primitives = defaults.primitives,
  }) {
    this.category = category || 'default';
    this.config = config;
    this.levels = logLevels;
    this.storage = storage;

    this.logline = logline;
    this.primitives = primitives;

    this.setupLoggers();
  }

  /**
   * Get formatter
   * @returns {function|undefined}
   */
  get format() {
    return this.config.format || this.buildLog;
  }

  /**
   * Set formatter
   * @param {function} formatFn
   */
  set format(formatFn) {
    this.config.format = formatFn;
  }

  /**
   * The log level
   * @returns {string}
   */
  get loglevel() {
    return this.config.loglevel;
  }

  /**
   * Set the log level
   * @param {string} loglevel
   */
  set loglevel(loglevel) {
    this.config.loglevel = loglevel;
  }

  /**
   * Colorize getter
   * @returns {boolean}
   */
  get colorize() {
    return this.config.colorize;
  }

  /**
   * Colorize setter
   * @param {boolean} value
   */
  set colorize(value) {
    this.config.colorize = value;
  }

  /**
   * Get the timestamp setting
   * @returns {boolean}
   */
  get timestamp() {
    return this.config.timestamp;
  }

  /**
   * Set false to remove the timestamp from the log output
   * @param {boolean} value
   */
  set timestamp(value) {
    this.config.timestamp = value;
  }

  /**
   * Get a new or stored logger
   * @param category
   * @returns {Logger}
   */
  getLogger(category) {
    const stored = this.storage.getLogger(category);
    if (stored) {
      return stored;
    }

    const logger = new Logger({
      category,
      config: new Config(),
      storage: this.storage,
    });

    if (category) {
      this.storage.addLogger(category, logger);
    }

    return logger;
  }

  /**
   * @param {ConfigParams} config
   * @returns {Logger}
   */
  configure(config) {
    this.loglevel = config.loglevel;
    this.timestamp = config.timestamp;
    this.colorize = config.colorize;
    this.format = config.format;

    return this;
  }

  /**
   * Setup per-level loggers
   * @private
   */
  setupLoggers() {
    Object.values(levels).forEach((level) => {
      this[level] = this.log.bind(this, level);
    });
  }

  /**
   * Return true if message level is less or equal to the logger's one
   * @param {string} loglevel - message log level
   * @returns {boolean}
   * @private
   */
  shouldLog(loglevel) {
    assertLogLevel(loglevel);

    const messageLevel = this.levels[loglevel.toLowerCase()];
    const loggerLevel = this.levels[this.loglevel];

    return loggerLevel >= messageLevel;
  }

  /**
   * Print out a message
   * @param {string|any} [level]
   * @param {any[]} args
   * @returns {void}
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

  buildLog({ args, level }) {
    const data = Parser.parseArray(args, this.primitives);
    const message = new Message({
      data,
      level,
      category: this.category,
      callsite: callsites(),
      timestamp: this.timestamp,
    });

    return this.logline.build(message).join(' ');
  }
}

module.exports = Logger;
