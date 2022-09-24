const { References } = require('./references');
const { Primitives } = require('./primitives');
const { JsonStr } = require('./jsonStr');

class Parser {
  /**
   * @param {object} input
   * @param {*} input.data
   * @param {Primitives} [input.primitives]
   * @returns {string}
   */
  static toJsonString({ data, primitives }) {
    const parser = new Parser({ primitives });
    parser.parse(data);

    return parser.str;
  }

  /**
   * @param {object} input
   * @param {*} input.data
   * @param {Primitives} [input.primitives]
   * @returns {string[]}
   */
  static toArrayString({ data, primitives }) {
    return data.map(item => (
      Primitives.isPrimitive(item)
        ? JsonStr.stringify(item)
        : Parser.toJsonString({ data: item, primitives })
    ));
  }

  /**
   * @param {Primitives} [primitives]
   */
  constructor({ primitives }) {
    this.primitives = primitives;

    this.references = new References();
    this.json = new JsonStr();
  }

  /**
   * @return {string}
   */
  get str() {
    return this.json.str;
  }

  /**
   * @param {*} message
   * @param {string} [path]
   * @param {string} [key]
   * @returns {*}
   */
  parse(message, path, key) {
    const ref = this.references.get(message);
    if (ref) {
      this.json.append(ref, key);

      return ref;
    }

    const data = this.primitives ? this.primitives.apply(message) : message;
    if (Primitives.isPrimitive(data)) {
      this.json.append(data, key);

      return data;
    }

    this.references.set(message, path);

    return this.handleStructure(data, key);
  }

  /**
   * @param {object|*[]} data
   * @param {string} [key]
   * @returns {object|*[]}
   * @private
   */
  handleStructure(data, key) {
    const handler = Array.isArray(data)
      ? this.handleArray
      : this.handleObject;

    return handler.call(this, data, key);
  }

  /**
   * @param {*[]}data
   * @param {string} [key]
   * @returns {*[]}
   * @private
   */
  handleArray(data, key) {
    this.json.startObject({ key, isArray: true });
    const { path } = this.references;

    const arr = data.map((item, idx) => this.parse(item, `${path}[${idx}]`));
    this.json.finishObject({ isArray: true });

    return arr;
  }

  /**
   * @param {object} data
   * @param {string} [key]
   * @returns {object}
   * @private
   */
  handleObject(data, key) {
    this.json.startObject({ key, isArray: false });
    const { path } = this.references;

    const obj = Object.entries(data).reduce(
      (acc, [k, v]) => (
        { ...acc, [k]: this.parse(v, [path, k].filter(Boolean).join('.'), k) }),
      {},
    );

    this.json.finishObject({ isArray: false });
    return obj;
  }
}

module.exports = {
  Parser,
};
