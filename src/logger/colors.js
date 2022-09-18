const { Colors } = require('../utils/colors');

class LoggerColors extends Colors {
  constructor(options) {
    super(options);

    this.levelMap = new Map(Object.entries({
      error: this.colors.red,
      warn: this.colors.yellow,
      info: this.colors.cyan,
      debug: this.colors.green,
      trace: this.colors.brightBlue,
    }));
  }

  /**
   * @param {object} input
   * @param {string} [input.level]
   * @param {string} input.text
   * @return {string}
   */
  colorize({ level, text }) {
    const color = this.levelMap.get(level);
    return super.colorize({ color, text });
  }
}

module.exports = {
  LoggerColors,
};
