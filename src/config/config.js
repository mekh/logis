/* eslint-disable no-underscore-dangle */
/**
 * @typedef ConfigParams
 * @property {string} [loglevel]
 * @property {boolean} [colorize]
 * @property {boolean} [json]
 * @property {function(*): *} [format]
 * @property {object} [logline]
 * @property {object} [primitives]
 */

const Errors = require('../common/errors');
const LogLevel = require('../logger/loglevel');
const { defaults } = require('../formatter');

const DEFAULT_STORAGE_LIMIT = 100;
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_USE_COLORS = false;
const DEFAULT_USE_JSON = false;

const envConfig = {
  get logLevel() { return process.env.LOG_LEVEL; },
  get colorize() { return process.env.LOG_COLORS; },
  get json() { return process.env.LOG_JSON; },
};

class Config {
  /**
   * The maximum number of loggers that could be stored and retrieved via logger.getLogger
   */
  static storageLimit = DEFAULT_STORAGE_LIMIT;

  static _logline;

  static _primitives;

  static _format;

  static _loglevel;

  static _colorize;

  static _json;

  static get logline() {
    const defaultLogline = Config.json
      ? defaults.loglineJson
      : defaults.logline;

    return Config._logline || defaultLogline;
  }

  static set logline(logline) {
    if (logline === undefined) {
      return;
    }

    Config._logline = logline;
  }

  static get primitives() {
    return Config._primitives || defaults.primitives;
  }

  /**
   * @param {Primitivas} primitives
   */
  static set primitives(primitives) {
    if (primitives === undefined) {
      return;
    }

    Config._primitives = primitives;
  }

  /**
   * @returns {string}
   */
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
    if (level === undefined) {
      return;
    }

    LogLevel.assertLogLevel(level);
    Config._loglevel = level.toLowerCase();
  }

  /**
   * @returns {boolean}
   */
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
    if (useColors === undefined) {
      return;
    }

    if (typeof useColors !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    Config._colorize = useColors;
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

  static get json() {
    if (Config._json !== undefined) {
      return Config._json;
    }

    return envConfig.json === 'true' || DEFAULT_USE_JSON;
  }

  /**
   * @param {boolean} useJson
   */
  static set json(useJson) {
    if (useJson === undefined) {
      return;
    }

    if (typeof useJson !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    Config._json = useJson;
    if (useJson && Config._logline === defaults.logline) {
      Config.logline = defaults.loglineJson;
    }

    if (!useJson && Config._logline === defaults.loglineJson) {
      Config.logline = defaults.logline;
    }

    if (Config._logline) {
      Config._logline.json = useJson;
    }
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
    Config.json = config.json;
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
