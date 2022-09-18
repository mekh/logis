const References = require('./references');
const { Primitives } = require('./primitives');

class Parser {
  /**
   * @param {*[]} arr
   * @param {Primitives} primitives
   * @returns {*[]}
   */
  static parse(arr, primitives) {
    return new Parser(primitives).parseMessage(arr);
  }

  /**
   * @param {Primitives} primitives
   */
  constructor(primitives = new Primitives()) {
    this.primitives = primitives;

    this.references = new References();
    this.json = '';
  }

  /**
   * @return {string}
   */
  get delimiter() {
    return !this.json || this.json.endsWith('{') || this.json.endsWith('[') ? '' : ',';
  }

  /**
   * @param {*} message
   * @param {string} [path]
   * @param {string} [key]
   * @returns {*}
   */
  parseMessage(message, path, key) {
    const ref = this.references.get(message);
    if (ref) {
      this.appendMessage(this.parsePrimitive(ref), key);

      return ref;
    }

    const data = this.primitives.apply(message);
    if (this.primitives.isPrimitive(data)) {
      const primitive = this.parsePrimitive(data);
      this.appendMessage(primitive, key);

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
    this.startObject({ key, isArray: true });
    const { path } = this.references;

    const arr = data.map((item, idx) => this.parseMessage(item, `${path}[${idx}]`));
    this.finishObject({ isArray: true });

    return arr;
  }

  /**
   * @param {object} data
   * @param {string} [key]
   * @returns {object}
   * @private
   */
  handleObject(data, key) {
    this.startObject({ key, isArray: false });
    const { path } = this.references;

    const obj = Object.entries(data).reduce(
      (acc, [k, v]) => (
        { ...acc, [k]: this.parseMessage(v, [path, k].filter(Boolean).join('.'), k) }),
      {},
    );

    this.finishObject({ isArray: false });
    return obj;
  }

  /**
   * @param {*} value
   * @return {string|number|boolean|null}
   */
  parsePrimitive(value) {
    if (!this.primitives.isPrimitive(value)) {
      throw new TypeError('Value is not a primitive');
    }

    const handler = {
      string: (data) => `"${data.replace(/[\\"]/g, '\\$&')}"`,
      symbol: (data) => `"${data.toString()}"`,
      bigint: (data) => `"${data.toString()}"`,
      number: (data) => (Number.isFinite(data) ? data : `"${data}"`),
      boolean: (data) => data,
      object: (data) => data,
      undefined: () => null,
      function: (data) => {
        const type = Function.prototype.toString.call(data).startsWith('class') ? 'Class' : 'Function';
        return `"<${type} ${data.name || 'anonymous'}>"`;
      },
    }[typeof value];

    return handler(value);
  }

  /**
   * @param {string|number} data
   * @param key
   */
  appendMessage(data, key) {
    this.json += key ? `${this.delimiter}"${key}":${data}` : `${this.delimiter}${data}`;
  }

  /**
   * @param {object} data
   * @param {string} [key]
   * @param {boolean} isArray
   */
  startObject({ key, isArray }) {
    const sym = isArray ? '[' : '{';
    const prefix = key ? `"${key}":` : '';

    this.json += `${this.delimiter}${prefix}${sym}`;
  }

  /**
   * @param {boolean} isArray
   */
  finishObject({ isArray }) {
    this.json += isArray ? ']' : '}';
  }
}

module.exports = {
  Parser,
};
