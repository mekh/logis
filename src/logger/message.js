class Message {
  /**
   * @param {boolean} json
   * @param {string} category
   * @param {string} level
   * @param {*[]} data
   * @param {object} callsite
   */
  constructor({ json, category, level, data, callsite }) {
    this.date = new Date();
    this.pid = process.pid;
    this.data = data;
    this.level = level;
    this.category = category;
    this.fileName = callsite.fileName;
    this.lineNumber = callsite.lineNumber;
    this.functionName = callsite.functionName;

    this.text = this.format(json);
  }

  /**
   * @param {boolean} json
   * @return {any[]|string}
   * @private
   */
  format(json) {
    return json
      ? this.data
      : this.data.map(item => (
        item && ['symbol', 'object'].includes(typeof item)
          ? JSON.stringify(item)
          : item
      )).join(' ');
  }
}

module.exports = {
  Message,
};
