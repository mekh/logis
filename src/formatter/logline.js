class Logline {
  constructor() {
    this.formatters = [];
    this.separator = ' ';
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
   * @param {string} separator
   * @return {Logline}
   */
  join(separator) {
    this.separator = separator || this.separator;
    return this;
  }

  /**
   * @param {*} message
   * @returns {*[]}
   */
  build(message) {
    return this.formatters
      .reduce((acc, fn) => ([...acc, fn(message)]), [])
      .join(this.separator);
  }
}

module.exports = {
  Logline,
};
