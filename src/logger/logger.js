/* eslint-disable class-methods-use-this */
/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {boolean} [json]
 * @property {function(*): *} [format]
 * @property {Logline} [logline]
 * @property {Primitives} [primitives]
 */
const { Parser } = require('../formatter');
const { Message } = require('./message');
const { Config } = require('../config');
const { Loglevel } = require('./loglevel');
const { colors } = require('../common/levels');
const callsites = require('../utils/callsite');

/**
 * @class Logger
 */
class Logger {
  /**
   * @constructor
   * @param {string} [category] - category name
   * @param {Config} config - logging level
   * @param {LoggerStorage} storage
   * @param {Loglevel} level
   */
  constructor({
    category,
    config,
    storage,
    level = Loglevel.create(),
  }) {
    this.category = category || 'default';
    this.config = config;
    this.level = level;
    this.storage = storage;

    this.setupLoggers();
  }

  /**
   * @return {Logline}
   */
  get logline() {
    return this.config.logline;
  }

  /**
   * @param {Logline} logline
   */
  set logline(logline) {
    this.config.logline = logline;
  }

  /**
   * @return {Primitives}
   */
  get primitives() {
    return this.config.primitives;
  }

  /**
   * @param {Primitives} primitives
   */
  set primitives(primitives) {
    this.config.primitives = primitives;
  }

  /**
   * @return {boolean}
   */
  get json() {
    return this.config.json;
  }

  /**
   * @param {boolean} json
   */
  set json(json) {
    this.config.json = json;
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
   * Get a new or stored logger
   * @param {string} [category]
   * @returns {Logger}
   */
  getLogger(category) {
    const stored = this.storage.getLogger({ category });
    if (stored) {
      return stored;
    }

    const logger = new Logger({
      category,
      config: new Config(),
      storage: this.storage,
    });

    this.storage.addLogger({ category, logger });

    return logger;
  }

  /**
   * @param {ConfigParams} config
   * @returns {Logger}
   */
  configure(config) {
    this.loglevel = config.loglevel;
    this.colorize = config.colorize;
    this.format = config.format;
    this.logline = config.logline;
    this.primitives = config.primitives;
    this.json = config.json;

    return this;
  }

  /**
   * Setup per-level loggers
   * @private
   */
  setupLoggers() {
    this.level.levels.forEach((level) => {
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
    return this.level.severity(this.loglevel) >= this.level.severity(loglevel);
  }

  /**
   * Print out a message
   * @param {string|any} [level]
   * @param {any[]} args
   * @returns {string|undefined}
   * @private
   */
  log(level, ...args) {
    const isValid = this.level.isValid(level);
    if (isValid && !this.shouldLog(level)) {
      return;
    }

    if (!isValid) {
      args.unshift(level);
    }

    const text = this.format({ args, level, logger: this });
    const output = this.colorize && this.level.isValid(level) ? colors[level.toLowerCase()](text) : text;

    console.log(output);
    return text;
  }

  buildLog({ args, level }) {
    const data = Parser.parseArray(args, this.primitives);
    const message = new Message({
      json: this.json,
      data,
      level,
      category: this.category,
      callsite: callsites(),
    });

    return this.logline.build(message);
  }
}

module.exports = {
  Logger,
};
