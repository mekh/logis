class Primitive {
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

  /**
   * @param {function(*): boolean} isFunction
   * @param {function(*): *} [formatter]
   */
  constructor(isFunction, formatter) {
    this.isFunction = isFunction;
    this.formatter = formatter;
  }

  /**
   * @param {*} data
   * @returns {boolean}
   */
  is(data) {
    return this.isFunction(data);
  }

  /**
   * @param {*} data
   * @returns {*}
   */
  format(data) {
    return this.formatter && typeof this.formatter === 'function'
      ? this.formatter(data)
      : data;
  }
}

module.exports = Primitive;
