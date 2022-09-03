const { Primitives, Parser } = require('../parser');
const { Logline } = require('./logline');

const logline = new Logline();
const loglineJson = new Logline({ json: true });
const primitives = new Primitives();

const wrap = data => `[${data}]`;

/**
 * The message argument in 'add' method is an instance of Message
 */
logline
  .add(message => wrap(message.date.toISOString()))
  .add(message => wrap(message.level.toUpperCase()))
  .add(message => wrap(message.pid))
  .add(message => wrap(message.category))
  .add(message => wrap(`${message.fileName}||${message.functionName || '-'}:${message.lineNumber || -1}`))
  .add(message => message.text);

loglineJson
  .add(message => ({ date: message.date.toISOString() }))
  .add(message => ({ level: message.level }))
  .add(message => ({ pid: message.pid }))
  .add(message => ({ category: message.category }))
  .add(message => ({ filename: message.fileName }))
  .add(message => ({ function: message.functionName || '-' }))
  .add(message => ({ line: message.lineNumber || -1 }))
  .add(message => ({ data: message.text }));

primitives
  .add(Primitives.typeof('function'), (data) => `<Function ${data.name || 'anonymous'}>`)
  .add(Primitives.instanceOf(Date), (date) => date.toISOString())
  .add(Primitives.instanceOf(Buffer), (data) => data.toString())
  .add(Primitives.instanceOf(Promise), () => '<Promise>')
  .add(Primitives.instanceOf(Error), (error) => Object
    .getOwnPropertyNames(error)
    .reduce((acc, prop) => `${acc}\n${prop}: ${error[prop]}`, ''));

/**
 * @type {{defaults: {logline: Logline, primitives: Primitives}, Logline: Logline, Primitives: Primitives, Parser: Parser}}
 */
module.exports = {
  Parser,
  Primitives,
  Logline,
  defaults: {
    logline,
    primitives,
    loglineJson,
  },
};
