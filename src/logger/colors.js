const { Colors } = require('../utils/colors');

class LoggerColors extends Colors {
  get error() {
    return this.red.bind(this);
  }

  get warn() {
    return this.yellow.bind(this);
  }

  get info() {
    return this.cyan.bind(this);
  }

  get debug() {
    return this.green.bind(this);
  }

  get trace() {
    return this.blue.bind(this);
  }
}

module.exports = {
  LoggerColors,
};
