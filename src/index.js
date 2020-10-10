const Logger = require('./logger/logger');

const logger = new Logger();

logger.getLogger = Logger.getLogger;
logger.configure = Logger.configure;

logger.default = logger;

module.exports = logger;
