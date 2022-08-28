class References {
  constructor() {
    this.references = new Map();
    this.path = '';
  }

  set(obj, path = '') {
    this.path = path;
    this.references.set(obj, this.path);
  }

  get(obj) {
    const path = this.references.get(obj);

    return path !== undefined
      ? `[REF => ${path || '.'}]`
      : null;
  }
}

module.exports = References;
