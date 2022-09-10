const { LoggerColors } = require('./colors');
const { Logger } = require('./logger');
const { Loglevel } = require('./loglevel');
const { Message } = require('./message');
const { LoggerStorage } = require('./storage');

module.exports = {
  Logger,
  Loglevel,
  LoggerStorage,
  Message,
  LoggerColors,
};
