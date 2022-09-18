const each = require('jest-each').default;
const logger = require('../src');
const { DEFAULT_LOG_LEVELS } = require('../src/constants');

const methods = DEFAULT_LOG_LEVELS;
const print = jest.spyOn(logger.transport.writer, 'write').mockImplementation(() => {});

class Test {
  constructor(log) {
    this.logger = log;
  }

  log(level, message) {
    this.logger[level](message);
  }
}

describe('# Context', () => {
  beforeEach(() => {
    print.mockClear();
    process.env.LOG_LEVEL = '';
  });

  each(methods)
    .it('should log in a class instance', (method) => {
      const category = `test_instance_${method}`;
      const log = logger.getLogger(category);
      log.loglevel = 'trace';

      const instance = new Test(log);
      instance.log(method);

      expect(print).toBeCalledWith(expect.stringContaining(category));
    });

  each(methods)
    .it('should log in promise', async (method) => {
      const category = `test_promise_${method}`;
      const log = logger.getLogger(category);

      const promise = new Promise(res => { setTimeout(() => res(method), 1); });
      await promise.then(log.info);

      expect(print).toHaveBeenCalledWith(expect.stringContaining(category));
    });

  each(methods)
    .it('should log in timer', async (method) => {
      const category = `test_timer_${method}`;
      const log = logger.getLogger(category);

      await new Promise(res => {
        setTimeout(log.info, 1);
        setTimeout(res, 2);
      });

      expect(print).toHaveBeenCalledWith(expect.stringContaining(category));
    });
});
