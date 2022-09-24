class Message {
  /**
   * @param {object} input
   * @param {*[]} data
   * @param {string} input.category
   * @param {string} input.level
   * @param {object} input.callsite
   */
  constructor({ data, category, level, callsite }) {
    this.date = new Date();
    this.pid = process.pid;
    this.data = data;
    this.level = level;
    this.category = category;
    this.fileName = callsite.fileName || '';
    this.lineNumber = callsite.lineNumber || '';
    this.functionName = callsite.functionName || '';

    this.text = '';
  }
}

module.exports = {
  Message,
};
