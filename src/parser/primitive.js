class Primitive {
  /**
   * @param {object} params
   * @param {function(*): boolean} [params.checkFn]
   * @param {function(*): *} [params.formatFn]
   */
  constructor({ checkFn, formatFn }) {
    if (typeof checkFn !== 'function') {
      throw new TypeError('checkFn must be a function');
    }

    this.checkFn = checkFn;
    this.formatFn = formatFn || ((data) => data);
  }

  is(data) {
    return this.checkFn(data);
  }

  format(data) {
    return this.is(data) ? this.formatFn(data) : data;
  }
}

module.exports = {
  Primitive,
};
