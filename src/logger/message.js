const fakeDate = new Proxy({}, {
  get() {
    return () => {};
  },
});

class Message {
  /**
   * @param {string} category
   * @param {string} level
   * @param {*[]} data
   * @param {object} callsite
   * @param {boolean} timestamp
   */
  constructor({ category, level, data, callsite, timestamp }) {
    this.date = timestamp ? new Date() : fakeDate;
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
