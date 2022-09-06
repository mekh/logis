class Colors {
  #enabled;

  /**
   * @param {object} [config]
   * @param {boolean} [config.enabled=false]
   * @param {string} [config.markStart='\x1B']
   * @param {string} [config.markEnd='\x1B[0m']
   */
  constructor({ enabled = false, markStart = '\x1B', markEnd = '\x1B[0m' } = {}) {
    this.#enabled = enabled;

    this.markStart = markStart;
    this.markEnd = markEnd;
  }

  get enabled() {
    return !!this.#enabled;
  }

  set enabled(value) {
    this.#enabled = !!value;
  }

  /**
   * @param {string} color
   * @param {string} text
   * @return {string}
   */
  colorize(color, text) {
    return this.enabled
      ? `${this.markStart}${color}${text}${this.markEnd}`
      : text;
  }

  /**
   * @param {string} text
   * @return {string}
   */
  red(text) {
    return this.colorize('[0;31m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  green(text) {
    return this.colorize('[0;32m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  yellow(text) {
    return this.colorize('[0;33m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  blue(text) {
    return this.colorize('[0;34m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  magenta(text) {
    return this.colorize('[0;35m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  cyan(text) {
    return this.colorize('[0;36m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  white(text) {
    return this.colorize('[0;37m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  gray(text) {
    return this.colorize('[0;90m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightRed(text) {
    return this.colorize('[0;91m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightGreen(text) {
    return this.colorize('[0;92m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightYellow(text) {
    return this.colorize('[0;93m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightBlue(text) {
    return this.colorize('[0;94m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightMagenta(text) {
    return this.colorize('[0;95m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightCyan(text) {
    return this.colorize('[0;96m', text);
  }

  /**
   * @param {string} text
   * @return {string}
   */
  brightWhite(text) {
    return this.colorize('[0;97m', text);
  }
}

module.exports = {
  Colors,
};
