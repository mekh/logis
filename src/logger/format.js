const { colors } = require('../common/levels');
const { isValidLevel } = require('./loglevel');

/**
 * Build a log prefix
 * @param {string} level
 * @param {Logger} logger
 * @return {string}
 */
const buildPrefix = ({ logger, level }) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const logLevel = isValidLevel(level) ? `[${level.toUpperCase()}]` : '';
  const pid = process.pid ? `[${process.pid}]` : '';
  const name = logger.category ? `[${logger.category}]` : '';

  return [timestamp, logLevel, pid, name].filter(Boolean).join(' ');
};

/**
 * Format a message
 * @param {string} message
 * @param {string} level
 * @param {Logger} logger
 * @return {string}
 */
const format = ({ message, logger, level }) => {
  const prefix = buildPrefix({ logger, level });
  const text = `${prefix} ${message}`;

  return logger.colorize && isValidLevel(level) ? colors[level](text) : text;
};

module.exports = {
  buildPrefix,
  format,
};
