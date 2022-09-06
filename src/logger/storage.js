const { Storage } = require('../utils/storage');
const errors = require('../common/errors');

const { DEFAULT_STORAGE_LIMIT } = require('../constants');

class LoggerStorage extends Storage {
  /**
   * @param {object} [options]
   * @param {number} [options.limit]
   */
  constructor({ limit = DEFAULT_STORAGE_LIMIT } = {}) {
    super({ limit });
  }

  /**
   * @param {object} options
   * @param {string} [options.category]
   * @param {Logger} options.logger
   */
  addLogger({ category, logger }) {
    this.validateCategory({ category });
    if (category === undefined || this.find({ category }).length) {
      return;
    }

    this.add({ category, logger });
  }

  /**
   * @param {object} options
   * @param {string} [options.category]
   * @returns {Logger|undefined}
   */
  getLogger({ category }) {
    this.validateCategory({ category });
    if (category === undefined) {
      return;
    }

    const stored = this.find({ category })[0];

    return stored ? stored.logger : undefined;
  }

  /**
   * @param {object} options
   * @param {symbol|string} [options.category]
   */
  validateCategory({ category }) { // eslint-disable-line class-methods-use-this
    if (category !== undefined && !['symbol', 'string'].includes(typeof category)) {
      throw errors.invalidCategory;
    }
  }
}

module.exports = {
  LoggerStorage,
};
