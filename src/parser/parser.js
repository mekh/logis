const References = require('./references');

class Parser {
  /**
   * @param {*[]} arr
   * @param {Primitives} primitives
   * @returns {*[]}
   */
  static parseArray(arr, primitives) {
    return new Parser(primitives).parseArray(arr);
  }

  /**
   * @param {Primitives} primitives
   */
  constructor(primitives) {
    this.primitives = primitives;

    this.references = new References();
  }

  /**
   * @param {*[]} arr
   * @returns {*[]}
   */
  parseArray(arr) {
    return arr.map(item => this.parseMessage(item));
  }

  /**
   * @param {*} message
   * @param {string} [path]
   * @returns {*}
   */
  parseMessage(message, path) {
    const ref = this.references.get(message);
    if (ref) {
      return ref;
    }

    const data = this.primitives.apply(message);
    if (this.primitives.isPrimitive(data)) {
      return data;
    }

    this.references.set(message, path);

    return this.handleStructure(data);
  }

  /**
   * @param {object|*[]} data
   * @returns {object|*[]}
   * @private
   */
  handleStructure(data) {
    const handler = Array.isArray(data)
      ? this.handleArray
      : this.handleObject;

    return handler.call(this, data);
  }

  /**
   * @param {*[]}data
   * @returns {*[]}
   * @private
   */
  handleArray(data) {
    const { path } = this.references;

    return data.map((item, idx) => this.parseMessage(item, `${path}[${idx}]`));
  }

  /**
   * @param {object} data
   * @returns {object}
   * @private
   */
  handleObject(data) {
    const { path } = this.references;

    return Object.entries(data).reduce(
      (acc, [k, v]) => (
        { ...acc, [k]: this.parseMessage(v, [path, k].filter(Boolean).join('.')) }),
      {},
    );
  }
}

module.exports = {
  Parser,
};
