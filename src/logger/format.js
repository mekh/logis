const { Parser, Primitives } = require('../parser');
const { Logline } = require('../formatter/logline');
const { Message } = require('./message');
const callsites = require('../utils/callsite');

const primitives = new Primitives();
const formatter = new Logline();

primitives
  .add(Primitives.typeof('function'), (data) => `<Function ${data.name || 'anonymous'}>`)
  .add(Primitives.instanceOf(Date))
  .add(Primitives.instanceOf(Promise), () => '<Promise>')
  .add(Primitives.instanceOf(Error), (data) => Object
    .getOwnPropertyNames(data)
    .reduce((acc, prop) => `${acc}\n${prop}: ${data[prop]}`, ''));

formatter
  .timestamp(timestamp => `[${timestamp.toISOString()}]`)
  .logLevel(level => `[${level.toUpperCase()}]`)
  .processPid(pid => `[${pid}]`)
  .logCategory(category => `[${category}]`)
  .fileName(filename => `[${filename.split('/').slice(-3).join('/')}]`)
  .logItem();

const format = ({ args, level, logger }) => {
  const message = new Message({
    items: Parser.parseArray(args, primitives),
    level,
    logger,
    callsite: callsites(),
  });

  const result = formatter.format(message);

  if (!logger.timestamp) {
    result.shift();
  }

  return result.join(' ');
};

module.exports = {
  format,
};
