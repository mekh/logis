class Logline {
  /**
   * @param {object} [config]
   * @param {boolean} [config.json]
   */
  constructor({ json = false } = {}) {
    this.formatters = [];
    this.separator = ' ';
    this.json = json;
  }

  /**
   * @param {function(data: *): *} [format]
   * @returns {Logline}
   */
  add(format) {
    this.formatters.push((message) => format(message));
    return this;
  }

  /**
   * @param {*} message
   * @returns {*[]}
   */
  build(message) {
    const data = this.formatters.reduce((acc, fn) => ([...acc, fn(message)]), []);

    return this.json ? this.buildJson(data) : this.buildLine(data);
  }

  /**
   * @param {string} separator
   * @returns {Logline}
   */
  join(separator) {
    this.separator = separator;
    return this;
  }

  /**
   * @param {*[]} data
   * @return {*}
   */
  buildLine(data) {
    return data.map(item => (item === undefined ? 'undefined' : item)).join(this.separator);
  }

  /**
   * @param {*[]} data
   * @return {string}
   */
  buildJson(data) { // eslint-disable-line class-methods-use-this
    const json = data.reduce((acc, item, idx) => (
      item && typeof item === 'object'
        ? { ...acc, ...item }
        : { ...acc, [`[ ${idx} ]`]: item }
    ), {});

    return JSON.stringify(json);
  }
}

module.exports = {
  Logline,
};
