const References = require('./references');

class Parser {
  /**
   * @param {Primitives} primitives
   */
  constructor(primitives) {
    this.primiteves = primitives;

    this.references = new References();
  }

  /**
   * @param {*} message
   * @param {string} [path]
   * @returns {*}
   */
  parse(message, path) {
    const ref = this.references.get(message);
    if (ref) {
      return ref;
    }

    const data = this.parsePrimitive(message);
    if (this.primiteves.isPrimitive(data)) {
      return data;
    }

    this.references.set(message, path);

    return this.parseStructure(data);
  }

  /**
   * @param {*} data
   * @returns {*}
   * @private
   */
  parsePrimitive(data) {
    const primitive = this.primiteves.get(data);

    return primitive ? primitive.format(data) : data;
  }

  /**
   * @param {object} data
   * @returns {object}
   */
  parseStructure(data) {
    const handler = Array.isArray(data)
      ? this.parseArray
      : this.parseObject;

    return handler.call(this, data);
  }

  /**
   * @param {[]}data
   * @returns {[]}
   */
  parseArray(data) {
    const { path } = this.references;

    return data.map((item, idx) => this.parse(item, `${path}[${idx}]`));
  }

  /**
   * @param {object} data
   * @returns {object}
   */
  parseObject(data) {
    const { path } = this.references;

    return Object.entries(data).reduce(
      (acc, [k, v]) => (
        { ...acc, [k]: this.parse(v, [path, k].filter(Boolean).join('.')) }),
      {},
    );
  }
}

module.exports = Parser;
