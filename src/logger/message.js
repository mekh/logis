class Message {
  /**
   * @param {string} category
   * @param {string} level
   * @param {*[]} data
   * @param {object} callsite
   */
  constructor({ category, level, data, callsite }) {
    this.date = new Date();
    this.pid = process.pid;
    this.data = data;
    this.level = level;
    this.category = category;
    this.fileName = callsite.fileName;
    this.lineNumber = callsite.lineNumber;
    this.functionName = callsite.functionName;

    this.payload = this.toString();
  }

  toString() {
    return this.data
      .map(item => (item && ['symbol', 'object'].includes(typeof item)
        ? JSON.stringify(item)
        : item))
      .join(' ');
  }
}

module.exports = {
  Message,
};
