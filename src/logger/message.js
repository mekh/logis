class Message {
  /**
   * @param {Logger} logger
   * @param {string} level
   * @param {*[]}items
   * @param {object} callsite
   */
  constructor({ logger, level, items, callsite }) {
    this.date = new Date();
    this.timestamp = logger.timestamp;
    this.pid = process.pid;
    this.items = items;
    this.level = level;
    this.category = logger.category || 'default';
    this.fileName = callsite.fileName;
    this.lineNumber = callsite.lineNumber;
    this.functionName = callsite.functionName;
  }

  /**
   * @param {Formatter} formatter
   * @returns {*}
   */
  format(formatter) {
    return formatter.format(this);
  }
}

module.exports = {
  Message,
};
