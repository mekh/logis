const { isValidLevel } = require('./loglevel');
const serialize = require('../utils/serialize');

/**
 * Build a log prefix
 * @param {Logger} logger
 * @param {logLevelString} [level]
 * @return {string}
 */
const buildPrefix = ({ logger, level }) => {
  const timestamp = logger.timestamp ? `[${new Date().toISOString()}]` : '';
  const logLevel = isValidLevel(level) ? `[${level.toUpperCase()}]` : '';
  const pid = `[${process.pid}]`;
  const name = logger.category ? `[${logger.category}]` : '[default]';

  return [timestamp, logLevel, pid, name].filter(Boolean).join(' ');
};

/**
 * Format a message
 * @param {any[]} args - arguments that have been passed to logger function, e.g. log.info(...args)
 * @param {Logger} logger - the logger instance
 * @param {logLevelString} [level] - message level; e.g. for log.debug it will be 'debug'
 * @return {string}
 */
const format = ({ args, logger, level }) => {
  const message = args.map(serialize).join(' ');
  const prefix = buildPrefix({ logger, level });
  return `${prefix} ${message}`;
};

module.exports = {
  buildPrefix,
  format,
};
