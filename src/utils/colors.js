/**
 * @type {{
 * magenta: string,
 * brightYellow: string,
 * green: string,
 * yellow: string,
 * brightGreen: string,
 * cyan: string,
 * brightRed: string,
 * brightWhite: string,
 * red: string,
 * gray: string,
 * brightCyan: string,
 * blue: string,
 * white: string,
 * brightBlue: string,
 * brightMagenta: string
 * }}
 */
const colors = {
  red: '[0;31m',
  green: '[0;32m',
  yellow: '[0;33m',
  blue: '[0;34m',
  magenta: '[0;35m',
  cyan: '[0;36m',
  white: '[0;37m',
  gray: '[0;90m',
  brightRed: '[0;91m',
  brightGreen: '[0;92m',
  brightYellow: '[0;93m',
  brightBlue: '[0;94m',
  brightMagenta: '[0;95m',
  brightCyan: '[0;96m',
  brightWhite: '[0;97m',
};

class Colors {
  #colors;

  constructor() {
    this.markStart = '\x1B';
    this.markEnd = '\x1B[0m';

    this.#colors = colors;
  }

  /**
   * @return {colors}
   */
  get colors() {
    return this.#colors;
  }

  /**
   * @param {object} input
   * @param {string} input.color
   * @param {string} input.text
   * @return {string}
   */
  colorize({ color, text }) {
    return `${this.markStart}${color}${text}${this.markEnd}`;
  }
}

module.exports = {
  Colors,
};
