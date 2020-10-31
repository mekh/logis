const each = require('jest-each').default;
const logger = require('../src');

const methods = Object.keys(logger.levels);

const print = jest.spyOn(console, 'log').mockImplementation();

describe('# Logger', () => {
  it('should return getLogger', () => {
    console.log(Object.keys(logger.levels).map((key, idx) => [key, idx + 1]));
    expect(logger).toHaveProperty('getLogger');
    expect(logger.getLogger).toBeInstanceOf(Function);
  });

  it('should return a logger', () => {
    const log = logger.configure().getLogger();

    methods.forEach((method) => {
      expect(log).toHaveProperty(method);
      expect(log[method]).toBeInstanceOf(Function);
    });
  });

  it('should log', () => {
    const log = logger.configure({ loglevel: 'trace' });
    methods.forEach((method) => log[method]('a'));

    expect(print).toBeCalledTimes(methods.length);
  });

  each(methods.map((key, idx) => [key, idx + 1]))
    .it('should filter output depending on loglevel', (loglevel, callsCount) => {
      const log = logger.configure({ loglevel });
      methods.forEach((method) => log[method]('a'));

      expect(print).toBeCalledTimes(callsCount);
    });

  it('should accept multiple arguments of any types', () => {
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

    expect(() => logger.error(...args)).not.toThrow();
  });

  it('should throw if unknown loglevel is passed', () => {
    expect(() => logger.configure({ loglevel: 'UNKNOWN' })).toThrow();
  });
});
