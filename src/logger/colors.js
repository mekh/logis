const { Colors } = require('../utils/colors');

class LoggerColors extends Colors {
  #enabled = false;

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

  get enabled() {
    return !!this.#enabled;
  }

  set enabled(value) {
    this.#enabled = !!value;
  }

  /**
   * @param {object} input
   * @param {string} [input.level]
   * @param {string} input.text
   * @return {string}
   */
  colorize({ level, text }) {
    const color = this.levelMap.get(level);
    return this.enabled && color
      ? super.colorize({ color, text })
      : text;
  }
}

module.exports = {
  LoggerColors,
};
