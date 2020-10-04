/**
 * Serialize a log item
 */
const serialize = (data) => {
  if (data !== null && ['object', 'symbol'].includes(typeof data)) {
    try {
      return JSON.stringify(data);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return data;
};

let defaultLogLevel = process.env.LOG_LEVEL || 'info';
const loggers = {};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const errors = {
  invalidLogLevel: new TypeError(`Invalid loglevel, valid levels are: ${Object.keys(levels).join(', ')}.`),
  invalidCategory: new TypeError('The category name must be a non-empty string or a Symbol'),
};

class Logger {
  static getLogger(category) {
    if (!category) {
      return new Logger();
    }

    if (!['symbol', 'string'].includes(typeof category)) {
      throw errors.invalidCategory;
    }

    return loggers[category] ? loggers[category] : new Logger(category);
  }

  static configure({ loglevel } = {}) {
    if (loglevel && !Object.keys(levels).includes(loglevel.toLowerCase())) {
      throw errors.invalidLogLevel;
    }

    defaultLogLevel = loglevel || defaultLogLevel;

    return Logger;
  }

  constructor(category = '', loglevel = defaultLogLevel) {
    this.category = category;

    this.levels = levels;

    this.assertLogLevel(loglevel);
    this.level = loglevel;

    if (category && loggers[category]) {
      loggers[category] = this;
    }
  }

  assertLogLevel(level) {
    if (!this.isValidLevel(level)) {
      throw errors.invalidLogLevel;
    }
  }

  hasLevel(level) {
    return Object.keys(this.levels).includes(level.toLowerCase());
  }

  isValidLevel(level) {
    return typeof level === 'string' && this.hasLevel(level);
  }

  shouldLog(level) {
    return this.levels[this.level.toLowerCase()] >= this.levels[level.toLowerCase()];
  }

  buildPrefix(level) {
    const timestamp = `[${new Date().toISOString()}]`;
    const logLevel = this.isValidLevel(level) ? `[${level.toUpperCase()}]` : '';
    const pid = process.pid ? `[${process.pid}]` : '';
    const category = this.category ? `[${this.category}]` : '';

    return [timestamp, logLevel, pid, category].filter(Boolean).join(' ');
  }

  log(level, ...args) {
    const isValidLevel = this.isValidLevel(level);
    if (isValidLevel && !this.shouldLog(level)) {
      return;
    }

    if (!isValidLevel) {
      args.unshift(level);
    }

    const message = args.map(serialize).join(' ');
    const prefix = this.buildPrefix(level);

    const exec = isValidLevel && Object.prototype.hasOwnProperty.call(console, level)
      ? console[level]
      : console.log;

    exec(prefix, message);
  }

  error(...args) {
    this.log.call(this, 'ERROR', ...args);
  }

  warn(...args) {
    this.log.call(this, 'WARN', ...args);
  }

  info(...args) {
    this.log.call(this, 'INFO', ...args);
  }

  debug(...args) {
    this.log.call(this, 'DEBUG', ...args);
  }

  trace(...args) {
    this.log.call(this, 'TRACE', ...args);
  }
}

const logger = new Logger();

logger.getLogger = Logger.getLogger;
logger.configure = Logger.configure;
logger.default = logger;

module.exports = logger;
