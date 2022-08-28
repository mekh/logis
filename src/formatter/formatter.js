class Formatter {
  constructor() {
    this.structure = [];
    this.separator = ' ';
  }

  /**
   * @param {function(data: Date): string} [wrapper]
   * @returns {Formatter}
   */
  timestamp(wrapper) {
    return this.addStruct(wrapper, (message) => message.date);
  }

  /**
   * @param {function(data: number): string} [wrapper]
   * @returns {Formatter}
   */
  processPid(wrapper) {
    return this.addStruct(wrapper, (message) => message.pid);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Formatter}
   */
  fileName(wrapper) {
    return this.addStruct(wrapper, (message) => message.fileName);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Formatter}
   */
  functionName(wrapper) {
    return this.addStruct(wrapper, (message) => message.functionName);
  }

  /**
   * @param {function(data: number): number} [wrapper]
   * @returns {Formatter}
   */
  lineNumber(wrapper) {
    return this.addStruct(wrapper, (message) => message.lineNumber);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Formatter}
   */
  logLevel(wrapper) {
    return this.addStruct(wrapper, (message) => message.level);
  }

  /**
   * @param {function(data: *[]): string} [wrapper]
   * @returns {Formatter}
   */
  logItem(wrapper) {
    const logFormat = wrapper || this.toString;

    return this.addStruct(logFormat, (message) => message.items);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Formatter}
   */
  logCategory(wrapper) {
    return this.addStruct(wrapper, (message) => message.category);
  }

  /**
   * @param {Message} message
   * @returns {*[]}
   */
  format(message) {
    return this.structure.length === 0
      ? [this.toString(message.items)]
      : this.structure.reduce((acc, fn) => ([...acc, fn(message)]), []);
  }

  /**
   * @param {function(data: *): *} [wrapper]
   * @param {function(data: *): *} fn
   * @returns {Formatter}
   * @private
   */
  addStruct(wrapper, fn) {
    this.structure.push((message) => (wrapper ? wrapper.call(this, fn(message)) : fn(message)));
    return this;
  }

  /**
   * @param {*[]} logItems
   * @returns {string}
   * @private
   */
  toString(logItems) {
    return logItems
      .map(item => (item && ['symbol', 'object'].includes(typeof item)
        ? JSON.stringify(item)
        : item))
      .join(this.separator);
  }
}

module.exports = {
  Formatter,
};
