const errors = require('../common/errors');
const { assertLogLevel } = require('../logger/loglevel');
const { format: defaultFormatter } = require('../logger/format');

const defaultLogLevel = 'info';

let loglevel;
let colorize;
let timestamp;
let formatter;

const envConfig = {
  get logLevel() { return process.env.LOG_LEVEL; },
  get colorize() { return process.env.LOG_COLORS; },
  get timestamp() { return process.env.LOG_TIMESTAMP; },
};

const config = {
  /**
   * The maximum number of loggers that could be stored and retrieved via logger.getLogger
   */
  storageLimit: 100,
  /**
   * The default log level
   * @return {logLevelString}
   */
  get defaultLogLevel() {
    const envLevel = envConfig.logLevel || '';

    return envLevel.toLowerCase()
        || loglevel
        || defaultLogLevel;
  },
  /**
   * Used to set the default log level for all loggers
   * @param {logLevelString} level
   */
  set defaultLogLevel(level) {
    if (level === undefined) {
      return;
    }

    assertLogLevel(level);
    loglevel = level.toLowerCase();
  },
  /**
   * Get the default timestamp setting
   * @returns {boolean}
   */
  get timestamp() {
    const envTimestamp = envConfig.timestamp || 'true';
    if (envTimestamp === 'false') {
      return false;
    }

    return timestamp !== undefined ? timestamp : envTimestamp === 'true';
  },
  /**
   * Set false to exclude the timestamp from the log output
   * @param value
   */
  set timestamp(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    timestamp = value;
  },
  /**
   * The default log level
   * @return {boolean}
   */
  get useColors() {
    return !!(envConfig.colorize === 'true' || colorize);
  },
  /**
   * Use colorized output for all loggers if true
   * @param {boolean} value
   */
  set useColors(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    colorize = value;
  },
  /**
   * Get message formatter
   */
  get format() {
    return formatter || defaultFormatter;
  },
  /**
   * Set default formatter
   * @param {formatFn} fn
   */
  set format(fn) {
    formatter = fn;
  },
};

module.exports = {
  config,
};
