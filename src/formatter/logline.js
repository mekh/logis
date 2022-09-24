const { Parser } = require('../parser');

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
   * @param primitives
   * @returns {string}
   */
  build(message, primitives) {
    // eslint-disable-next-line no-param-reassign
    message.text = this.json
      ? message.data
      : Parser.toArrayString({ data: message.data, primitives }).join(' ');

    const data = this.formatters.reduce((acc, fn) => ([...acc, fn(message)]), []);

    return this.json ? this.buildJson(data, primitives) : this.buildLine(data);
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
   * @return {string}
   */
  buildLine(data) {
    return data.map(item => (item === undefined ? 'undefined' : item)).join(this.separator);
  }

  /**
   * @param {*[]} data
   * @param {Primitives} primitives
   * @return {string}
   */
  buildJson(data, primitives) { // eslint-disable-line class-methods-use-this
    const json = data.reduce((acc, item, idx) => (
      item && typeof item === 'object' && !Array.isArray(item)
        ? { ...acc, ...item }
        : { ...acc, [`[ ${idx} ]`]: item }
    ), {});

    return Parser.toJsonString({ data: json, primitives });
  }
}

module.exports = {
  Logline,
};
