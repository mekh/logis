/* eslint-disable no-underscore-dangle */
/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {function(*): *} [format]
 * @property {object} [logline]
 * @property {object} [primitives]
 */

const Errors = require('../common/errors');
const LogLevel = require('../logger/loglevel');
const formatter = require('../formatter');

const DEFAULT_STORAGE_LIMIT = 100;
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_USE_COLORS = false;

const envConfig = {
  get logLevel() { return process.env.LOG_LEVEL; },
  get colorize() { return process.env.LOG_COLORS; },
};

class Config {
  /**
   * The maximum number of loggers that could be stored and retrieved via logger.getLogger
   */
  static storageLimit = DEFAULT_STORAGE_LIMIT;

  static _logline = formatter.defaults.logline;

  static _primitives = formatter.defaults.primitives;

  static _format;

  static _loglevel;

  static _colorize;

  static get logline() {
    return Config._logline;
  }

  static set logline(logline) {
    if (logline === undefined) {
      return;
    }

    Config._logline = logline;
  }

  static get primitives() {
    return Config._primitives;
  }

  static set primitives(primitives) {
    if (primitives === undefined) {
      return;
    }

    Config._primitives = primitives;
  }

  static get loglevel() {
    if (Config._loglevel !== undefined) {
      return Config._loglevel;
    }

    const env = envConfig.logLevel;

    return LogLevel.isValidLevel(env)
      ? env.toLowerCase()
      : DEFAULT_LOG_LEVEL;
  }

  /**
   * @param {string} level
   */
  static set loglevel(level) {
    const loglevel = level || DEFAULT_LOG_LEVEL;
    LogLevel.assertLogLevel(loglevel);
    Config._loglevel = loglevel.toLowerCase();
  }

  static get colorize() {
    if (Config._colorize !== undefined) {
      return Config._colorize;
    }

    return envConfig.colorize === 'true' || DEFAULT_USE_COLORS;
  }

  /**
   * @param {boolean} useColors
   */
  static set colorize(useColors) {
    const colorize = useColors !== undefined
      ? useColors
      : DEFAULT_USE_COLORS;

    if (typeof colorize !== 'boolean') {
      throw Errors.invalidTypeBool;
    }
    Config._colorize = colorize;
  }

  /**
   * @return {(function({args: *, level: *, logger: *}): *)}
   */
  static get format() {
    return Config._format;
  }

  /**
   * @param {function(*): string} formatFn
   */
  static set format(formatFn) {
    if (formatFn === undefined) {
      return;
    }

    if (typeof formatFn !== 'function') {
      throw Errors.invalidTypeFn;
    }
    Config._format = formatFn;
  }

  /**
   * @param {ConfigParams} config
   * @return {Config}
   */
  static setGlobalConfig(config) {
    Config.loglevel = config.loglevel;
    Config.colorize = config.colorize;
    Config.format = config.format;
    Config.logline = config.logline;
    Config.primitives = config.primitives;
  }

  /**
   * @param {ConfigParams} [config]
   */
  constructor({
    loglevel = Config.loglevel,
    colorize = Config.colorize,
    format = Config.format,
  } = {}) {
    this.loglevel = loglevel;
    this.colorize = colorize;
    this.format = format;
  }

  /**
   * The default log level
   * @returns {string}
   */
  get loglevel() {
    return this._loglevel;
  }

  /**
   * Used to set the default log level for all loggers
   * @param {string|undefined} level
   */
  set loglevel(level) {
    if (level === undefined) {
      return;
    }

    LogLevel.assertLogLevel(level);
    this._loglevel = level.toLowerCase();
  }

  /**
   * The default log level
   * @returns {boolean}
   */
  get colorize() {
    return this._colorize;
  }

  /**
   * Use colorized output for all loggers if true
   * @param {boolean} value
   */
  set colorize(value) {
    if (value === undefined) {
      return;
    }

    if (typeof value !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    this._colorize = value;
  }

  /**
   * Get message formatter
   * @returns {function(*): string}
   */
  get format() {
    return this._format;
  }

  /**
   * Set default formatter
   * @param {function(*): string} value
   */
  set format(value) {
    if (value === undefined) {
      return;
    }

    if (typeof value !== 'function') {
      throw Errors.invalidTypeFn;
    }

    this._format = value;
  }
}

module.exports = {
  Config,
};
