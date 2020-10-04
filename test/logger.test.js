const each = require('jest-each').default;
const { configure } = require('../src/logger');

const methods = ['error', 'warn', 'info', 'debug', 'trace'];

describe('# Utils - Logger', () => {
  it('should return getLogger', () => {
    const log = configure({});
    expect(log).toHaveProperty('getLogger');
    expect(log.getLogger).toBeInstanceOf(Function);
  });

  it('should return a logger', () => {
    const log = configure().getLogger();

    methods.forEach((method) => {
      expect(log).toHaveProperty(method);
      expect(log[method]).toBeInstanceOf(Function);
    });
  });

  it('should log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    const log = configure({ loglevel: 'trace' }).getLogger();
    methods.forEach((method) => log[method]('a'));

    expect(spy).toBeCalledTimes(methods.length);
    spy.mockRestore();
  });

  each([
    ['error', 1],
    ['warn', 2],
    ['info', 3],
    ['debug', 4],
    ['trace', 5],
  ])
    .it('should filter output depending on loglevel', (loglevel, callsCount) => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      const log = configure({ loglevel }).getLogger();
      methods.forEach((method) => log[method]('a'));

      // eslint-disable-next-line jest/no-standalone-expect
      expect(spy).toBeCalledTimes(callsCount);
      spy.mockRestore();
    });

  it('should accept multiple arguments of any types', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    const log = configure({}).getLogger();
    const args = [
      { toJSON: () => { throw new Error('OOPS!!!'); } },
      1,
      'a',
      null,
      undefined,
      NaN,
      function a() {},
      Symbol('symbol'),
      [1, 'a'],
      { a: 1 },
    ];

    expect(() => log.error(...args)).not.toThrow();
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();
  });

  it('should throw if unknown loglevel is passed', () => {
    expect(() => configure({ loglevel: 'UNKNOWN' })).toThrow();
  });
});
