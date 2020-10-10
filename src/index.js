const Logger = require('./logger/logger');
const storage = require('./utils/storage');
const configure = require('./config/configure');

const config = (logger, options) => {
  configure(options);
  return logger;
};

const getLogger = (category) => {
  const stored = storage.getLogger(category);
  if (stored) {
    return stored;
  }

  const newLogger = new Logger();
  newLogger.getLogger = getLogger;
  newLogger.configure = config.bind(null, newLogger);

  if (category) {
    storage.addLogger(category, newLogger);
  }

  return newLogger;
};

module.exports = getLogger();
