const each = require('jest-each').default;
const Logger = require('../src/logger/logger');
const { Config } = require('../src/config');
const logger = require('../src');

const methods = Object.keys(logger.levels);

const print = jest.spyOn(console, 'log').mockImplementation();

describe('# Logger', () => {
  beforeEach(() => {
    print.mockClear();
  });

  it('should return getLogger', () => {
    expect(logger).toBeInstanceOf(Logger);
    expect(logger.getLogger).toBeInstanceOf(Function);
    expect(logger.configure).toBeInstanceOf(Function);
  });

  it('should return a default logger', () => {
    methods.forEach((method) => {
      expect(logger).toHaveProperty(method);
      expect(logger[method]).toBeInstanceOf(Function);
    });
  });

  it('should use the storage limit', () => {
    const { storageLimit } = Config;
    const log1 = logger.getLogger('A');

    for (let i = 0; i < storageLimit; i += 1) {
      logger.getLogger(i.toString());
    }

    const log2 = logger.getLogger('A');
    expect(log1).not.toBe(log2);
  });

  it('default logger - should call console.log in all log methods', () => {
    const { loglevel } = logger;
    logger.loglevel = 'trace';

    methods.forEach((method) => logger[method]('a'));

    expect(print).toBeCalledTimes(methods.length);
    logger.loglevel = loglevel;
  });

  it('getLogger - should call console.log in all log methods', () => {
    const log = logger.getLogger();
    log.loglevel = 'trace';

    methods.forEach((method) => log[method]('a'));

    expect(print).toBeCalledTimes(methods.length);
  });

  it('should log', () => {
    const log = logger.getLogger();
    log.log('abc', 'xyz');

    expect(print).toBeCalledWith(expect.stringMatching(/abc.*xyz/));
  });

  it('should set colorize', () => {
    const log = logger.getLogger();
    log.colorize = false;
    log.colorize = true;

    expect(log.colorize).toBe(true);
  });

  it('should throw if non-boolean is passed', () => {
    const log = logger.getLogger();
    expect(() => { log.colorize = 'a'; }).toThrow();
  });

  it('should handle Error objects', () => {
    logger.info(new Error('error_message'));

    expect(print).toBeCalledWith(expect.stringContaining('error_message'));
  });

  it('should return the same logger', () => {
    const log1 = logger.getLogger('ABC');
    const log2 = logger.getLogger('ABC');

    expect(log1).toBe(log2);
  });

  it('should throw if an invalid category passed', () => {
    expect(() => logger.getLogger(true)).toThrow();
  });

  each(methods.map((key, idx) => [key, idx + 1]))
    .it('should filter output depending on loglevel', (loglevel, callsCount) => {
      const log = logger.configure({ loglevel }).getLogger();
      log.colorize = true;
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

  it('should not throw if no loglevel is passed', () => {
    expect(() => logger.configure({ })).not.toThrow();
  });

  it('should use custom formatter', () => {
    const log = logger.getLogger();
    log.format = jest.fn();

    log.info('A', 'B', 'C');

    expect(log.format).toBeCalledWith({ args: ['A', 'B', 'C'], level: 'info', logger: log });
  });

  it('should throw if format is not a function', () => {
    expect(() => { logger.getLogger().format = 'a'; }).toThrow();
  });
});
