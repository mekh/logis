const colors = require('../utils/colors');

const colorize = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.cyan,
  debug: colors.green,
  trace: colors.blue,
};

module.exports = {
  colors: colorize,
};
