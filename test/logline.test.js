const { Logline } = require('../src/formatter/logline');

describe('# Logline', () => {
  let logline;

  beforeEach(() => {
    logline = new Logline();
  });

  it('should have proper default settings', () => {
    expect(logline.formatters).toMatchObject([]);
    expect(logline.separator).toBe(' ');
    expect(logline.json).toBe(false);
  });

  it('add - should return this', () => {
    const instance = logline.add();
    expect(instance).toEqual(logline);
  });

  it('should call buildJson', () => {
    logline.json = true;
    logline.add(data => data);
    const spy = jest.spyOn(logline, 'buildJson');

    logline.build(123);

    expect(spy).toBeCalledWith([123]);
    spy.mockClear();
  });

  it('should call buildLine', () => {
    logline.json = false;
    logline.add(data => data);
    const spy = jest.spyOn(logline, 'buildLine');

    logline.build(321);

    expect(spy).toBeCalledWith([321]);
    spy.mockClear();
  });

  it('should handle separator', () => {
    const instance = logline.join('||||');
    expect(instance).toEqual(logline);
    expect(logline.separator).toBe('||||');
  });

  it('should build json out of structured data', () => {
    const data = { abc: 1 };
    logline.add(() => data);
    logline.json = true;
    const result = logline.build(data);

    expect(result).toBe(JSON.stringify(data));
  });

  it('should build json out of unstructured data', () => {
    const data = [11, 22, 33];
    logline.add(() => data);
    logline.json = true;
    const result = logline.build(data);

    expect(result).toBe(JSON.stringify({ 0: data[0], 1: data[1], 2: data[2] }));
  });

  it('should apply formatters', () => {
    const message = { a: 'aaa', b: 'bbb', c: 'ccc' };
    const fn1 = jest.fn().mockImplementation((msg) => msg.a);
    const fn2 = jest.fn().mockImplementation((msg) => msg.b);
    const fn3 = jest.fn().mockImplementation((msg) => msg.c);

    logline.add(fn1).add(fn2).add(fn3);
    const result = logline.build(message);

    expect(fn1).toBeCalledWith(message);
    expect(fn2).toBeCalledWith(message);
    expect(fn3).toBeCalledWith(message);
    expect(result).toBe('aaa bbb ccc');
  });
});
