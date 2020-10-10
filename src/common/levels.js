const colors = require('../utils/colors');

const levels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  trace: 'trace',
};

const logLevels = {
  [levels.error]: 0,
  [levels.warn]: 1,
  [levels.info]: 2,
  [levels.debug]: 3,
  [levels.trace]: 4,
};

const colorize = {
  [levels.error]: colors.red,
  [levels.warn]: colors.yellow,
  [levels.info]: colors.cyan,
  [levels.debug]: colors.green,
  [levels.trace]: colors.blue,
};

module.exports = {
  levels,
  logLevels,
  colors: colorize,
};
