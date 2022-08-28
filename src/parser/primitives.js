const Primitive = require('./primitive');

class Primitives {
  static types = [
    'number',
    'string',
    'boolean',
    'undefined',
    'bigint',
    'symbol',
    'function',
  ];

  /**
   * @param {string} type - one of 'number', 'string', 'object', 'undefined', 'boolean', 'symbol', 'function'
   * @returns {function(*): boolean}
   */
  static typeof(type) {
    return (data) => typeof data === type; // eslint-disable-line valid-typeof
  }

  /**
   * @param {object} cls
   * @returns {function(*): boolean}
   */
  static instanceOf(cls) {
    return (data) => data instanceof cls;
  }

  constructor() {
    this.primitives = [];
  }

  /**
   * @param {function(*): boolean} checkFn
   * @param {function(*): *} [formatFn]
   * @returns {Primitives}
   */
  add(checkFn, formatFn) {
    this.primitives.unshift(new Primitive({ checkFn, formatFn }));
    return this;
  }

  /**
   * @param {*} data
   * @returns {Primitive|undefined}
   */
  get(data) {
    return this.primitives.find(item => item.is(data));
  }

  /**
   * @param {*} data
   * @returns {boolean}
   */
  isPrimitive(data) {
    return data === null || Primitives.types.includes(typeof data) || this.get(data);
  }
}

module.exports = Primitives;
