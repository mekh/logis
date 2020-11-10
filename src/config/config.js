const errors = require('../common/errors');
const { assertLogLevel } = require('../logger/loglevel');
const { format } = require('../logger/format');

const defaultLogLevel = 'info';

let loglevel;
let colorize;
let timestamp;

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
    const { LOG_LEVEL = '' } = process.env;

    return loglevel
        || LOG_LEVEL.toLowerCase()
        || defaultLogLevel;
  },
  /**
   * The default log level
   * @return {boolean}
   */
  get useColors() {
    return colorize || process.env.LOG_COLORS === 'true';
  },
  /**
   * Get the default timestamp setting
   * @returns {boolean}
   */
  get timestamp() {
    const { LOG_TIMESTAMP = 'true' } = process.env;
    if (LOG_TIMESTAMP === 'false') {
      return false;
    }

    return timestamp !== undefined ? timestamp : LOG_TIMESTAMP === 'true';
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
   * Used to set the default log level for all loggers
   * @param {logLevelString} level
   */
  set defaultLogLevel(level) {
    assertLogLevel(level);

    loglevel = level.toLowerCase();
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
   * Default message formatter
   */
  format,
};

module.exports = {
  config,
};
