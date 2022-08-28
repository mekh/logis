class Primitive {
  /**
   * @param {object} params
   * @param {function(*): boolean} [params.checkFn]
   * @param {function(*): *} [params.formatFn]
   */
  constructor({ checkFn, formatFn }) {
    this.checkFn = checkFn || (() => false);
    this.formatFn = formatFn || ((data) => data);
  }

  is(data) {
    return this.checkFn(data);
  }

  format(data) {
    return this.formatFn(data);
  }
}

module.exports = Primitive;
