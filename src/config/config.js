const { format } = require('../logger/format');

let loglevel;
let colorize;

module.exports = {
  get defaultLogLevel() {
    return loglevel || process.env.LOG_LEVEL || 'info';
  },
  get useColors() {
    return colorize || process.env.LOG_COLORS === 'true';
  },
  set defaultLogLevel(value) {
    if (!value) {
      return;
    }

    loglevel = value;
  },
  set useColors(value) {
    if (typeof value !== 'boolean') {
      return;
    }

    colorize = value;
  },
  format,
};
