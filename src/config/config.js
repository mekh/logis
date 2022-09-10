/* eslint-disable no-underscore-dangle */
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

const Errors = require('../common/errors');
const { defaults } = require('../formatter');
const { DEFAULT_LOG_LEVEL, DEFAULT_USE_JSON, DEFAULT_USE_COLORS, DEFAULT_USE_CALLSITES } = require('../constants');
const { Loglevel } = require('../logger/loglevel');

const envConfig = {
  get logLevel() { return process.env.LOG_LEVEL; },
  get colorize() { return process.env.LOG_COLORS; },
  get json() { return process.env.LOG_JSON; },
  get callsites() { return process.env.LOG_CALLSITES; },
};

class Config {
  static #logline;

  static #primitives;

  static #format;

  static #loglevel;

  static #colorize;

  static #json;

  static #callsites;

  static get logline() {
    const defaultLogline = Config.json
      ? defaults.loglineJson
      : defaults.logline;

    return Config.#logline || defaultLogline;
  }

  static set logline(logline) {
    if (logline === undefined) {
      return;
    }

    Config.#logline = logline;
  }

  static get primitives() {
    return Config.#primitives || defaults.primitives;
  }

  /**
   * @param {Primitives} primitives
   */
  static set primitives(primitives) {
    if (primitives === undefined) {
      return;
    }

    Config.#primitives = primitives;
  }

  /**
   * @returns {string}
   */
  static get loglevel() {
    if (Config.#loglevel !== undefined) {
      return Config.#loglevel;
    }

    const env = envConfig.logLevel || '';

    return Loglevel.defaults.includes(env.toLowerCase())
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

    Loglevel.assert(level);
    Config.#loglevel = level.toLowerCase();
  }

  /**
   * @returns {boolean}
   */
  static get colorize() {
    if (Config.#colorize !== undefined) {
      return Config.#colorize;
    }

    return ['true', 'false'].includes(envConfig.colorize)
      ? envConfig.colorize === 'true'
      : DEFAULT_USE_COLORS;
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

    Config.#colorize = useColors;
  }

  /**
   * @return {(function({args: *, level: *, logger: *}): *)}
   */
  static get format() {
    return Config.#format;
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
    Config.#format = formatFn;
  }

  static get json() {
    if (Config.#json !== undefined) {
      return Config.#json;
    }

    return ['true', 'false'].includes(envConfig.json)
      ? envConfig.json === 'true'
      : DEFAULT_USE_JSON;
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

    Config.#json = useJson;
    if (useJson && Config.#logline === defaults.logline) {
      Config.logline = defaults.loglineJson;
    }

    if (!useJson && Config.#logline === defaults.loglineJson) {
      Config.logline = defaults.logline;
    }

    if (Config.#logline) {
      Config.#logline.json = useJson;
    }
  }

  /**
   * @returns {boolean}
   */
  static get callsites() {
    if (Config.#callsites !== undefined) {
      return Config.#callsites;
    }

    return ['true', 'false'].includes(envConfig.callsites)
      ? envConfig.callsites === 'true'
      : DEFAULT_USE_CALLSITES;
  }

  /**
   * @param {boolean} useCallsites
   */
  static set callsites(useCallsites) {
    if (useCallsites === undefined) {
      return;
    }

    if (typeof useCallsites !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    Config.#callsites = useCallsites;
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
    Config.callsites = config.callsites;
  }

  #_logline;

  #_primitives;

  #_format;

  #_loglevel;

  #_colorize;

  #_json;

  #_callsites;

  /**
   * @param {ConfigParams} [config]
   */
  constructor({
    loglevel = Config.loglevel,
    colorize = Config.colorize,
    format = Config.format,
    logline = Config.logline,
    primitives = Config.primitives,
    json = Config.json,
    callsites = Config.callsites,
  } = {}) {
    this.loglevel = loglevel;
    this.colorize = colorize;
    this.format = format;
    this.logline = logline;
    this.primitives = primitives;
    this.json = json;
    this.callsites = callsites;
  }

  /**
   * The default log level
   * @returns {string}
   */
  get loglevel() {
    return this.#_loglevel;
  }

  /**
   * Used to set the default log level for all loggers
   * @param {string|undefined} level
   */
  set loglevel(level) {
    if (level === undefined) {
      return;
    }

    Loglevel.assert(level);
    this.#_loglevel = level.toLowerCase();
  }

  /**
   * The default log level
   * @returns {boolean}
   */
  get colorize() {
    return this.#_colorize;
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

    this.#_colorize = value;
  }

  /**
   * Get message formatter
   * @returns {function(*): string}
   */
  get format() {
    return this.#_format;
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

    this.#_format = value;
  }

  get json() {
    return this.#_json;
  }

  /**
   * @param {boolean} useJson
   */
  set json(useJson) {
    if (useJson === undefined) {
      return;
    }

    if (typeof useJson !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    this.#_json = useJson;
    if (useJson && this.#_logline === defaults.logline) {
      this.logline = defaults.loglineJson;
    }

    if (!useJson && this.#_logline === defaults.loglineJson) {
      this.logline = defaults.logline;
    }

    this.#_logline.json = useJson;
  }

  get logline() {
    return this.#_logline;
  }

  set logline(logline) {
    if (logline === undefined) {
      return;
    }

    this.#_logline = logline;
  }

  get primitives() {
    return this.#_primitives;
  }

  /**
   * @param {Primitives} primitives
   */
  set primitives(primitives) {
    if (primitives === undefined) {
      return;
    }

    this.#_primitives = primitives;
  }

  /**
   * The default log level
   * @returns {boolean}
   */
  get callsites() {
    return this.#_callsites;
  }

  /**
   * Use callsites
   * @param {boolean} useCallsites
   */
  set callsites(useCallsites) {
    if (useCallsites === undefined) {
      return;
    }

    if (typeof useCallsites !== 'boolean') {
      throw Errors.invalidTypeBool;
    }

    this.#_callsites = useCallsites;
  }
}

module.exports = {
  Config,
};
