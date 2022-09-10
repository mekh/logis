const errors = require('../src/common/errors');
const { Config } = require('../src/config');
const { Logline, Primitives, defaults } = require('../src/formatter');

describe('# Config', () => {
  describe('# Default settings', () => {
    it('format - should be default', () => {
      expect(Config.format).toBe(undefined);
    });

    it('logline - should be default', () => {
      expect(Config.logline).toBe(defaults.logline);
    });

    it('primitives - should be default', () => {
      expect(Config.primitives).toBe(defaults.primitives);
    });

    it('json - should be default', () => {
      expect(Config.json).toBe(false);
    });

    it('logLevel - should be default', () => {
      expect(Config.loglevel).toBe('info');
    });

    it('colorize - should be default', () => {
      expect(Config.colorize).toBe(false);
    });
  });

  describe('# Validation', () => {
    it('loglevel - should throw', () => {
      expect(() => { Config.loglevel = 'a'; }).toThrow(errors.invalidLogLevel);
    });

    it('colorize - should throw', () => {
      expect(() => { Config.colorize = 'a'; }).toThrow(errors.invalidTypeBool);
    });

    it('json - should throw', () => {
      expect(() => { Config.json = 'a'; }).toThrow(errors.invalidTypeBool);
    });

    it('format - should throw', () => {
      expect(() => { Config.format = 'a'; }).toThrow(errors.invalidTypeFn);
    });
  });

  describe('# Environment', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = '';
      process.env.LOG_COLORS = '';
      process.env.LOG_JSON = '';
    });

    it('LOG_LEVEL - info', () => {
      process.env.LOG_LEVEL = 'info';
      expect(Config.loglevel).toBe('info');
    });

    it('LOG_LEVEL - error', () => {
      process.env.LOG_LEVEL = 'error';
      expect(Config.loglevel).toBe('error');
    });

    it('LOG_LEVEL - warn', () => {
      process.env.LOG_LEVEL = 'warn';
      expect(Config.loglevel).toBe('warn');
    });

    it('LOG_LEVEL - debug', () => {
      process.env.LOG_LEVEL = 'debug';
      expect(Config.loglevel).toBe('debug');
    });

    it('LOG_LEVEL - trace', () => {
      process.env.LOG_LEVEL = 'trace';
      expect(Config.loglevel).toBe('trace');
    });

    it('LOG_LEVEL - should use lower case for process.env', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      expect(Config.loglevel).toBe('debug');
    });

    it('LOG_COLORS - should return true if LOG_COLORS is true', () => {
      process.env.LOG_COLORS = 'true';
      expect(Config.colorize).toBe(true);
    });

    it('LOG_COLORS - should return false if LOG_COLORS is false', () => {
      process.env.LOG_COLORS = 'false';
      expect(Config.colorize).toBe(false);
    });

    it('LOG_JSON - should return true if LOG_JSON is true', () => {
      process.env.LOG_JSON = 'true';
      expect(Config.json).toBe(true);
    });

    it('LOG_JSON - should return true if LOG_JSON is false', () => {
      process.env.LOG_JSON = 'false';
      expect(Config.json).toBe(false);
    });
  });

  describe('# Custom settings', () => {
    it('logline JSON - should return default loglineJson if json is true', () => {
      Config.json = true;
      expect(Config.logline).toBe(defaults.loglineJson);
    });

    it('logline jSON - should return custom logline if json true', () => {
      const logline = new Logline().add(() => 1);
      Config.logline = logline;
      Config.json = true;

      expect(Config.logline).toBe(logline);
      expect(logline.json).toBe(true);
    });

    it('colorize - should store the default colorize option', () => {
      process.env.LOG_COLORS = 'false';
      Config.colorize = true;
      expect(Config.colorize).toBe(true);
    });

    it('json - should switch default logline to json', () => {
      Config.logline = defaults.logline;
      Config.json = true;

      expect(Config.logline).toBe(defaults.loglineJson);
    });

    it('json - should switch default logline to line', () => {
      Config.logline = defaults.loglineJson;
      Config.json = false;

      expect(Config.logline).toBe(defaults.logline);
    });
  });

  describe('# Global settings', () => {
    let globalConfig;
    beforeEach(() => {
      globalConfig = {
        loglevel: 'trace',
        colorize: true,
        format: () => 123,
        logline: new Logline().add(() => {}),
        primitives: new Primitives().add(() => true, () => 123),
        json: true,
      };

      Config.setGlobalConfig(globalConfig);
    });

    it('should set global settings', () => {
      expect(Config.loglevel).toEqual(globalConfig.loglevel);
      expect(Config.colorize).toEqual(globalConfig.colorize);
      expect(Config.format).toEqual(globalConfig.format);
      expect(Config.logline).toEqual(globalConfig.logline);
      expect(Config.primitives).toEqual(globalConfig.primitives);
      expect(Config.json).toEqual(globalConfig.json);
    });

    it('should inherit global settings for instances', () => {
      const config = new Config();

      expect(config.loglevel).toEqual(globalConfig.loglevel);
      expect(config.colorize).toEqual(globalConfig.colorize);
      expect(config.format).toEqual(globalConfig.format);
      expect(config.logline).toEqual(globalConfig.logline);
      expect(config.primitives).toEqual(globalConfig.primitives);
      expect(config.json).toEqual(globalConfig.json);
    });

    it('logline - should not set undefined', () => {
      Config.logline = undefined;

      expect(Config.logline).toBe(globalConfig.logline);
    });

    it('primitives - should not set undefined', () => {
      Config.primitives = undefined;

      expect(Config.primitives).toBe(globalConfig.primitives);
    });

    it('loglevel - should not set undefined', () => {
      Config.loglevel = undefined;

      expect(Config.loglevel).toBe(globalConfig.loglevel);
    });

    it('colorize - should not set undefined', () => {
      Config.colorize = undefined;

      expect(Config.colorize).toBe(globalConfig.colorize);
    });

    it('json - should not set undefined', () => {
      Config.json = undefined;

      expect(Config.json).toBe(globalConfig.json);
    });

    it('format - should not set undefined', () => {
      Config.format = undefined;

      expect(Config.format).toBe(globalConfig.format);
    });
  });

  describe('# Instance', () => {
    let config;
    beforeEach(() => {
      config = new Config();
    });

    it('should inherit default settings', () => {
      expect(config.loglevel).toEqual(Config.loglevel);
      expect(config.colorize).toEqual(Config.colorize);
      expect(config.format).toEqual(Config.format);
      expect(config.json).toEqual(Config.json);
      expect(config.logline).toEqual(Config.logline);
      expect(config.primitives).toEqual(Config.primitives);
    });

    it('logline - should not set undefined', () => {
      config.logline = undefined;

      expect(config.logline).toBe(Config.logline);
    });

    it('primitives - should not set undefined', () => {
      config.primitives = undefined;

      expect(config.primitives).toBe(Config.primitives);
    });

    it('loglevel - should not set undefined', () => {
      config.loglevel = undefined;

      expect(config.loglevel).toBe(Config.loglevel);
    });

    it('colorize - should not set undefined', () => {
      config.colorize = undefined;

      expect(config.colorize).toBe(Config.colorize);
    });

    it('json - should not set undefined', () => {
      config.json = undefined;

      expect(config.json).toBe(Config.json);
    });

    it('format - should not set undefined', () => {
      config.format = undefined;

      expect(config.format).toBe(Config.format);
    });

    it('loglevel - should throw', () => {
      expect(() => { config.loglevel = 'a'; }).toThrow(TypeError);
    });

    it('colorize - should throw', () => {
      expect(() => { config.colorize = 'a'; }).toThrow(errors.invalidTypeBool);
    });

    it('format - should throw', () => {
      expect(() => { config.format = 'a'; }).toThrow(errors.invalidTypeFn);
    });

    it('json - should throw', () => {
      expect(() => { config.json = 'a'; }).toThrow(errors.invalidTypeBool);
    });

    it('loglevel - should set', () => {
      config.loglevel = 'trace';

      expect(config.loglevel).toBe('trace');
    });

    it('colorize - should set', () => {
      config.colorize = true;

      expect(config.colorize).toBe(true);
    });

    it('format - should set', () => {
      const format = () => 'xyz';
      config.format = format;

      expect(config.format).toBe(format);
    });

    it('json - should switch default logline to json', () => {
      config.logline = defaults.logline;
      config.json = true;

      expect(config.logline).toBe(defaults.loglineJson);
    });

    it('json - should switch default logline to line', () => {
      config.logline = defaults.loglineJson;
      config.json = false;

      expect(config.logline).toBe(defaults.logline);
    });

    it('json - should set json=true to logline instance', () => {
      const logline = new Logline({ json: false });
      const conf = new Config({ logline });

      conf.json = true;
      expect(logline.json).toBe(true);
    });
  });
});
