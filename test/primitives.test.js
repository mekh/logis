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
      expect(typeof Primitives.instanceOf).toBe('function');
    });

    it('static - should return a function', () => {
      expect(typeof Primitives.typeof('number')).toBe('function');
      expect(typeof Primitives.instanceOf('number')).toBe('function');
    });

    it('static - should define a type match', () => {
      const fn = Primitives.typeof('string');

      expect(fn('abc')).toBe(true);
      expect(fn(123)).toBe(false);
    });

    it('static - should define an instance match', () => {
      const fn = Primitives.instanceOf(Error);

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
  });
});
