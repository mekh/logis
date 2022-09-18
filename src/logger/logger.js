/* eslint-disable class-methods-use-this */
/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {boolean} [json]
 * @property {function(*): *} [format]
 * @property {Logline} [logline]
 * @property {Primitives} [primitives]
 * @property {boolean} [callsites]
 */
const { Parser } = require('../formatter');
const { Message } = require('./message');
const { Config } = require('../config');
const { Stdout } = require('../transports/stdout');
const callsites = require('../utils/callsite');

/**
 * @class Logger
 */
class Logger {
  #config;

  #storage;

  #colors;

  #loglevel;

  /**
   * @constructor
   * @param {string} [category] - category name
   * @param {Config} config
   * @param {LoggerStorage} storage
   * @param {Loglevel} loglevel
   * @param {Colors } colors
   * @param {*} transport
   */
  constructor({
    category = 'default',
    config,
    storage,
    loglevel,
    colors,
    transport = new Stdout(),
  }) {
    this.category = category;

    this.#loglevel = loglevel;
    this.#config = config;
    this.#storage = storage;
    this.#colors = colors;
    this.transport = transport;

    this.setupLoggers();
  }

  /**
   * @param {Config} config
   */
  set config(config) {
    this.#config = config;
  }

  /**
   * @return {Logline}
   */
  get logline() {
    return this.#config.logline;
  }

  /**
   * @param {Logline} logline
   */
  set logline(logline) {
    this.#config.logline = logline;
  }

  /**
   * @return {Primitives}
   */
  get primitives() {
    return this.#config.primitives;
  }

  /**
   * @param {Primitives} primitives
   */
  set primitives(primitives) {
    this.#config.primitives = primitives;
  }

  /**
   * @return {boolean}
   */
  get json() {
    return this.#config.json;
  }

  /**
   * @param {boolean} json
   */
  set json(json) {
    this.#config.json = json;
  }

  /**
   * Get formatter
   * @returns {function|undefined}
   */
  get format() {
    return this.#config.format;
  }

  /**
   * Set formatter
   * @param {function} formatFn
   */
  set format(formatFn) {
    this.#config.format = formatFn;
  }

  /**
   * The log level
   * @returns {string}
   */
  get loglevel() {
    return this.#config.loglevel;
  }

  /**
   * Set the log level
   * @param {string} loglevel
   */
  set loglevel(loglevel) {
    this.#config.loglevel = loglevel;
  }

  /**
   * Colorize getter
   * @returns {boolean}
   */
  get colorize() {
    return this.#config.colorize;
  }

  /**
   * @param {boolean} value
   */
  set colorize(value) {
    this.#config.colorize = value;
  }

  /**
   * @returns {boolean}
   */
  get callsites() {
    return this.#config.callsites;
  }

  /**
   * Colorize setter
   * @param {boolean} value
   */
  set callsites(value) {
    this.#config.callsites = value;
  }

  /**
   * Get a new or stored logger
   * @param {string} [category]
   * @returns {Logger}
   */
  getLogger(category) {
    const stored = this.#storage.getLogger({ category });
    if (stored) {
      return stored;
    }

    const logger = new Logger({
      category,
      config: new Config(),
      storage: this.#storage,
      colors: this.#colors,
      loglevel: this.#loglevel,
    });

    this.#storage.addLogger({ category, logger });

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
    this.callsites = config.callsites;

    return this;
  }

  /**
   * Setup per-level loggers
   * @private
   */
  setupLoggers() {
    this.#loglevel.levels.forEach((level) => {
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
    return this.#loglevel.severity(this.loglevel) >= this.#loglevel.severity(loglevel);
  }

  /**
   * Print out a message
   * @param {string|any} [level]
   * @param {any[]} data
   * @returns {string|undefined}
   * @private
   */
  log(level, ...data) {
    const isValid = this.#loglevel.isValid(level);
    if (isValid && !this.shouldLog(level)) {
      return;
    }

    if (!isValid) {
      data.unshift(level);
    }

    const text = this.format
      ? this.format({ args: data, level, logger: this })
      : this.parse({ data, level });

    const output = this.colorizeOutput({ level, text });

    this.transport.write(output);
    return text;
  }

  parse({ data, level }) {
    const parsed = Parser.parse(data, this.primitives);
    return this.buildLog({ data: parsed, level });
  }

  buildLog({ data, level }) {
    const message = new Message({
      json: this.json,
      data,
      level,
      category: this.category,
      callsite: this.callsites ? callsites.getCallsite() : {},
    });

    return this.logline.build(message);
  }

  colorizeOutput({ level, text }) {
    return this.colorize
      ? this.#colors.colorize({ level, text })
      : text;
  }
}

module.exports = {
  Logger,
};
