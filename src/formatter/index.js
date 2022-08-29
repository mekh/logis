const { Primitives, Parser } = require('../parser');
const { Logline } = require('./logline');

const logline = new Logline();
const primitives = new Primitives();

const wrap = data => (data ? `[${data}]` : '');

/**
 * The message argument in 'add' method is an instance of Message
 */
logline
  .add(message => wrap(message.date.toISOString()))
  .add(message => wrap(message.level.toUpperCase()))
  .add(message => wrap(message.pid))
  .add(message => wrap(message.category))
  .add(message => wrap(message.fileName.split('/').slice(-3).join('/')))
  .add(message => message.payload);

primitives
  .add(Primitives.typeof('function'), (data) => `<Function ${data.name || 'anonymous'}>`)
  .add(Primitives.instanceOf(Date), (date) => date.toISOString())
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
  },
};
