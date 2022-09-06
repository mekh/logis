const each = require('jest-each').default;
const logger = require('../src');
const { Logger } = require('../src/logger/logger');
const { Logline, Primitives } = require('../src/formatter');

const { DEFAULT_STORAGE_LIMIT, DEFAULT_LOG_LEVELS } = require('../src/constants');

const methods = DEFAULT_LOG_LEVELS;

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
    const log1 = logger.getLogger('A');

    for (let i = 0; i < DEFAULT_STORAGE_LIMIT; i += 1) {
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
    const recursive = { prop: 1 };
    recursive.rec = recursive;

    const args = [
      { toJSON: () => { throw new Error('OOPS!!!'); } },
      1,
      'a',
      null,
      undefined,
      NaN,
      Symbol('symbol'),
      function a() {},
      () => {},
      new Date(),
      new Promise((res) => { res(); }),
      new Error('errors'),
      Buffer.from('xyz'),
      [1, 'a'],
      { a: 1 },
      recursive,
    ];

    expect(() => logger.error(...args)).not.toThrow();
  });

  it('should throw if unknown loglevel is passed', () => {
    expect(() => logger.configure({ loglevel: 'UNKNOWN' })).toThrow();
  });

  it('should not throw if no loglevel is passed', () => {
    expect(() => logger.configure({ })).not.toThrow();
  });

  it('should not throw if config is undefined', () => {
    expect(() => logger.configure()).not.toThrow();
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

  it('should set/get logline', () => {
    const log = logger.getLogger('123');
    const logline = new Logline().add(() => 'bcd');

    log.logline = logline;
    expect(log.logline).toBe(logline);
  });

  it('should set/get primitives', () => {
    const log = logger.getLogger('999');
    const logPrimitives = new Primitives();

    log.primitives = logPrimitives;
    expect(log.primitives).toBe(logPrimitives);
  });

  it('should set/get json', () => {
    const log = logger.getLogger('xyz');

    log.json = true;
    expect(log.json).toBe(true);
  });

  it('should configure', () => {
    const log = logger.getLogger('new-log');

    const config = {
      loglevel: 'warn',
      colorize: true,
      format: function format() {},
      logline: new Logline(),
      primitives: new Primitives(),
      json: true,
    };

    log.configure(config);
    expect(log.loglevel).toBe(config.loglevel);
    expect(log.colorize).toBe(config.colorize);
    expect(log.format).toBe(config.format);
    expect(log.logline).toBe(config.logline);
    expect(log.primitives).toBe(config.primitives);
    expect(log.json).toBe(config.json);
  });
});
