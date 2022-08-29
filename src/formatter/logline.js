class Logline {
  constructor() {
    this.formatters = [];
  }

  /**
   * @param {function(data: *): *} [wrapper]
   * @returns {Logline}
   */
  add(wrapper) {
    this.formatters.push((message) => wrapper.call(this, message));
    return this;
  }

  /**
   * @param {*} message
   * @returns {*[]}
   */
  build(message) {
    return this.formatters.reduce((acc, fn) => ([...acc, fn(message)]), []);
  }
}

module.exports = {
  Logline,
};
