const { Primitives } = require('../src/parser/primitives');
const { Primitive } = require('../src/parser/primitive');

describe('# Primitives', () => {
  describe('# Static', () => {
    it('should have a list of primitive types', () => {
      expect(Primitives.types).toBeDefined();
      expect(Primitives.types).toStrictEqual(expect.any(Array));
      expect(Primitives.types.filter(item => typeof item !== 'string')).toHaveLength(0);
    });

    it('static - should have methods', () => {
      expect(typeof Primitives.typeof).toBe('function');
      expect(typeof Primitives.instanceof).toBe('function');
    });

    it('static - should return a function', () => {
      expect(typeof Primitives.typeof('number')).toBe('function');
      expect(typeof Primitives.instanceof('number')).toBe('function');
    });

    it('static - should define a type match', () => {
      const fn = Primitives.typeof('string');

      expect(fn('abc')).toBe(true);
      expect(fn(123)).toBe(false);
    });

    it('static - should define an instance match', () => {
      const fn = Primitives.instanceof(Error);

      expect(fn(new Error())).toBe(true);
      expect(fn(Buffer.from(''))).toBe(false);
    });
  });

  describe('# Instance', () => {
    let primitives;
    beforeEach(() => {
      primitives = new Primitives();
    });

    it('should not have primitives', () => {
      expect(primitives.primitives).toHaveLength(0);
    });

    it('should inherit types', () => {
      expect(primitives.types).toBe(Primitives.types);
    });

    it('should add a primitive', () => {
      const checkFn = function abc() {};
      const formatFn = function xyz() {};

      const res = primitives.add(checkFn, formatFn);

      expect(res).toBe(primitives);
      expect(primitives.primitives).toHaveLength(1);
      expect(primitives.primitives[0]).toBeInstanceOf(Primitive);
      expect(primitives.primitives[0].checkFn).toBe(checkFn);
      expect(primitives.primitives[0].formatFn).toBe(formatFn);
    });

    it('should return undefined', () => {
      expect(primitives.get(1)).toBe(undefined);
    });

    it('should return proper primitives', () => {
      primitives
        .add(item => typeof item === 'number')
        .add(item => typeof item === 'undefined')
        .add(item => typeof item === 'number', num => num.toFixed(2))
        .add(item => typeof item === 'string')
        .add(item => typeof item === 'number');

      expect(primitives.get(1)).toHaveLength(3);
      expect(primitives.get('1')).toHaveLength(1);
      expect(primitives.get(undefined)).toHaveLength(1);
    });

    it('should apply proper primitives', () => {
      const formatNumber1 = jest.fn((num) => num.toFixed(2));
      const formatNumber2 = jest.fn((num) => num * 100);
      const formatStr1 = jest.fn((str) => str.toUpperCase());
      const formatStr2 = jest.fn((str) => `---${str}---`);

      primitives.add(Primitives.typeof('number'), formatNumber1);
      primitives.add(Primitives.typeof('string'), formatStr1);
      primitives.add(Primitives.typeof('number'), formatNumber2);
      primitives.add(Primitives.typeof('string'), formatStr2);

      const num = primitives.apply(1.123);
      const str = primitives.apply('abc');

      expect(formatNumber1).toHaveBeenCalledTimes(1);
      expect(formatNumber1).toHaveBeenCalledWith(1.123);
      expect(formatNumber2).not.toHaveBeenCalled();

      expect(formatStr1).toHaveBeenCalledTimes(1);
      expect(formatStr1).toHaveBeenCalledWith('abc');

      expect(formatStr2).toHaveBeenCalledTimes(1);
      expect(formatStr2).toHaveBeenCalledWith('ABC');

      expect(num).toStrictEqual('1.12');
      expect(str).toStrictEqual('---ABC---');
    });
  });
});
