class Storage {
  /**
   * @param {object} config
   * @param {number} [config.limit]
   */
  constructor({ limit }) {
    this.limit = limit;
    this.storage = [];
  }

  /**
   * @param {*} item
   * @return {void}
   */
  add(item) {
    if (this.storage.length >= this.limit) {
      this.storage.shift();
    }

    this.storage.push(item);
  }

  /**
   * @param {*} condition
   * @return {*[]}
   */
  find(condition) {
    return condition !== null && typeof condition === 'object' && !Array.isArray(condition)
      ? this.byObjects(condition)
      : this.byPlain(condition);
  }

  /**
   * @param {Object.<string, *>} filters
   * @return {*[]}
   * @private
   */
  byObjects(filters) {
    const items = this.storage.filter(item => item !== null && typeof item === 'object' && !Array.isArray(item));

    return Object
      .entries(filters)
      .reduce((acc, [key, value]) => acc.filter(item => item[key] === value), items);
  }

  /**
   * @param {*|*[]} filters
   * @returns {*[]}
   * @private
   */
  byPlain(filters) {
    const conditions = Array.isArray(filters) ? filters : [filters];
    const items = this.storage.filter(item => (
      Array.isArray(filters)
        ? Array.isArray(item)
        : item === null || typeof item !== 'object'));

    return conditions.reduce((acc, filter) => acc
      .filter(item => (
        Array.isArray(item) && Array.isArray(filters) ? item.includes(filter) : item === filter
      )), items);
  }
}

module.exports = {
  Storage,
};
