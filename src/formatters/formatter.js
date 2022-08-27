const Primitive = require('./primitive');

class Formatter {
  constructor() {
    this.primitives = [];

    this.defaultPrimitive = new Primitive(() => true);
  }

  add(isFunction, formatter) {
    this.primitives.unshift(new Primitive(isFunction, formatter));
    return this;
  }

  get(data) {
    const primitive = this.primitives.find(item => item.is(data));

    return primitive || this.defaultPrimitive;
  }

  format(data) {
    return this.get(data).format(data);
  }
}

module.exports = Formatter;
