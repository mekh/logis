class JsonStr {
  /**
   * @param {*} value
   * @return {string|number|boolean|null}
   */
  static jsonize(value) {
    if (typeof value === 'object' && value !== null) {
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

  static stringify(value) {
    if (typeof value === 'object' && value !== null) {
      throw new TypeError('Value is not a primitive');
    }

    const handler = {
      string: (data) => data,
      symbol: (data) => data.toString(),
      bigint: (data) => data.toString(),
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

  constructor() {
    this.str = '';
  }

  /**
   * @return {string}
   */
  get delimiter() {
    return !this.str || this.str.endsWith('{') || this.str.endsWith('[') ? '' : ',';
  }

  /**
   * @param {string|number} data
   * @param {string} key
   */
  append(data, key) {
    const primitive = JsonStr.jsonize(data);
    this.str += key ? `${this.delimiter}"${key}":${primitive}` : `${this.delimiter}${primitive}`;
  }

  /**
   * @param {object} data
   * @param {string} [key]
   * @param {boolean} isArray
   */
  startObject({ key, isArray }) {
    const sym = isArray ? '[' : '{';
    const prefix = key ? `"${key}":` : '';

    this.str += `${this.delimiter}${prefix}${sym}`;
  }

  /**
   * @param {boolean} isArray
   */
  finishObject({ isArray }) {
    this.str += isArray ? ']' : '}';
  }
}

module.exports = {
  JsonStr,
};
