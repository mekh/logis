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
    /**
     * @type {Primitive[]}
     */
    this.primitives = [];
    this.types = Primitives.types;
  }

  /**
   * @param {function(*): boolean} checkFn
   * @param {function(*): *} [formatFn]
   * @returns {Primitives}
   */
  add(checkFn, formatFn) {
    this.primitives.push(new Primitive({ checkFn, formatFn }));
    return this;
  }

  /**
   * @param {*} data
   * @returns {Primitive[]|undefined}
   */
  get(data) {
    const result = this.primitives.filter(item => item.is(data));

    return result.length ? result : undefined;
  }

  /**
   * @param {*} data
   * @return {*}
   */
  apply(data) {
    const primitives = this.primitives.filter(item => item.is(data));

    return primitives.reduce((acc, primitive) => primitive.format(acc), data);
  }

  /**
   * @param {*} data
   * @returns {boolean}
   */
  isPrimitive(data) {
    return data === null || this.types.includes(typeof data);
  }
}

module.exports = {
  Primitives,
};
