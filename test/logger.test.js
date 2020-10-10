const each = require('jest-each').default;
const { configure } = require('../src');

const methods = ['error', 'warn', 'info', 'debug', 'trace'];

const print = jest.spyOn(console, 'log').mockImplementation();

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
    const log = configure({ loglevel: 'trace' }).getLogger();
    methods.forEach((method) => log[method]('a'));

    expect(print).toBeCalledTimes(methods.length);
  });

  each([
    ['error', 1],
    ['warn', 2],
    ['info', 3],
    ['debug', 4],
    ['trace', 5],
  ])
    .it('should filter output depending on loglevel', (loglevel, callsCount) => {
      const log = configure({ loglevel }).getLogger();
      methods.forEach((method) => log[method]('a'));

      expect(print).toBeCalledTimes(callsCount);
    });

  it('should accept multiple arguments of any types', () => {
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
  });

  it('should throw if unknown loglevel is passed', () => {
    expect(() => configure({ loglevel: 'UNKNOWN' })).toThrow();
  });
});
