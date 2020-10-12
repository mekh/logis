const errors = require('../common/errors');
const { levels } = require('../common/levels');
const { format } = require('../logger/format');

let loglevel;
let colorize;

const config = {
  get defaultLogLevel() {
    return loglevel || process.env.LOG_LEVEL || 'info';
  },
  get useColors() {
    return colorize || process.env.LOG_COLORS === 'true';
  },
  set defaultLogLevel(value) {
    if (value && !Object.keys(levels).includes(value.toLowerCase())) {
      throw errors.invalidLogLevel;
    }

    loglevel = value;
  },
  set useColors(value) {
    if (typeof value !== 'boolean') {
      throw errors.invalidTypeBool;
    }

    colorize = value;
  },
  format,
};

module.exports = {
  config,
};
