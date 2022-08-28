const callsite = require('./callsite');

class FormatConfig {
  constructor() {
    this.structure = [];
  }

  get add() {
    return this;
  }

  timestamp(wrapper) {
    return this.addStruct(wrapper, () => new Date());
  }

  processPid(wrapper) {
    return this.addStruct(wrapper, () => process.pid);
  }

  fileName(wrapper) {
    return this.addStruct(wrapper, () => callsite().fileName);
  }

  functionName(wrapper) {
    return this.addStruct(wrapper, () => callsite().functionName || 'anonymous');
  }

  lineNumber(wrapper) {
    return this.addStruct(wrapper, () => callsite().lineNumber || -1);
  }

  logLevel(wrapper) {
    return this.addStruct(wrapper, (message) => message.level);
  }

  logItem(wrapper) {
    return this.addStruct(wrapper, (message) => message.text);
  }

  logCategory(wrapper) {
    return this.addStruct(wrapper, (message) => message.category || 'default');
  }

  format(message) {
    return this.structure.reduce((acc, fn) => ([...acc, fn(message)]), []);
  }

  addStruct(wrapper, fn) {
    this.structure.push((message) => (wrapper ? wrapper(fn(message)) : fn(message)));
    return this;
  }
}

module.exports = FormatConfig;
