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
  return `${prefix} ${message}`;
};

module.exports = {
  buildPrefix,
  format,
};
