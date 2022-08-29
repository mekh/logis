class Logline {
  constructor() {
    this.structure = [];
    this.separator = ' ';
  }

  /**
   * @param {function(data: Date): string} [wrapper]
   * @returns {Logline}
   */
  timestamp(wrapper) {
    return this.addStruct(wrapper, (message) => message.date);
  }

  /**
   * @param {function(data: number): string} [wrapper]
   * @returns {Logline}
   */
  processPid(wrapper) {
    return this.addStruct(wrapper, (message) => message.pid);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Logline}
   */
  fileName(wrapper) {
    return this.addStruct(wrapper, (message) => message.fileName);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Logline}
   */
  functionName(wrapper) {
    return this.addStruct(wrapper, (message) => message.functionName);
  }

  /**
   * @param {function(data: number): number} [wrapper]
   * @returns {Logline}
   */
  lineNumber(wrapper) {
    return this.addStruct(wrapper, (message) => message.lineNumber);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Logline}
   */
  logLevel(wrapper) {
    return this.addStruct(wrapper, (message) => message.level);
  }

  /**
   * @param {function(data: *[]): string} [wrapper]
   * @returns {Logline}
   */
  logItem(wrapper) {
    const logFormat = wrapper || this.toString;

    return this.addStruct(logFormat, (message) => message.items);
  }

  /**
   * @param {function(data: string): string} [wrapper]
   * @returns {Logline}
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
   * @returns {Logline}
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
  Logline,
};
