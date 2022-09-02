const { Primitive } = require('../src/parser/primitive');

describe('# Primitive', () => {
  it('should instantiate', () => {
    const checkFn = () => {};
    const formatFn = () => {};

    const primitive = new Primitive({ checkFn, formatFn });

    expect(primitive.checkFn).toStrictEqual(checkFn);
    expect(primitive.formatFn).toStrictEqual(formatFn);
  });

  it('should throw if no checkFn passed', () => {
    expect(() => new Primitive({})).toThrow(TypeError);
  });

  it('should throw if checkFn is not a function', () => {
    expect(() => new Primitive({ checkFn: 123 })).toThrow(TypeError);
  });

  it('should set default formatFn', () => {
    const checkFn = () => {};
    const primitive = new Primitive({ checkFn });

    expect(primitive.formatFn).toStrictEqual(expect.any(Function));
  });

  it('should return data as it is by default', () => {
    const checkFn = () => {};
    const primitive = new Primitive({ checkFn });

    const data = { a: 1 };
    expect(primitive.formatFn(data)).toStrictEqual(data);
  });

  it('should use checkFn', () => {
    const checkFn = jest.fn();
    const primitive = new Primitive({ checkFn });

    primitive.is(123);
    expect(checkFn).toBeCalledWith(123);
  });

  it('should define a type', () => {
    const checkFn = (data) => typeof data === 'string';

    const primitive = new Primitive({ checkFn });
    expect(primitive.is(123)).toBe(false);
    expect(primitive.is('123')).toBe(true);
  });

  it('should format matched items', () => {
    const checkFn = (data) => data && typeof data.prop === 'string';
    const formatFn = (data) => `---${data.prop}---`;

    const match = { prop: '123' };

    const primitive = new Primitive({ checkFn, formatFn });
    expect(primitive.format(match)).toBe('---123---');
  });

  it('should not format unmatched items', () => {
    const checkFn = (data) => data && typeof data.prop === 'string';
    const formatFn = () => 'abc';

    const mismatch = { prop: 999 };

    const primitive = new Primitive({ checkFn, formatFn });
    expect(primitive.format(mismatch)).toBe(mismatch);
  });
});
