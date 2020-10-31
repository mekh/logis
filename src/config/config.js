const errors = require('../common/errors');
const { assertLogLevel } = require('../logger/loglevel');
const { format } = require('../logger/format');

let loglevel;
let colorize;

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
    return loglevel || process.env.LOG_LEVEL || 'info';
  },
  /**
   * The default log level
   * @return {boolean}
   */
  get useColors() {
    return colorize || process.env.LOG_COLORS === 'true';
  },
  /**
   * Used to set the default log level for all loggers
   * @param {logLevelString} level
   */
  set defaultLogLevel(level) {
    if (!level) {
      return;
    }

    assertLogLevel(level);

    loglevel = level;
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
