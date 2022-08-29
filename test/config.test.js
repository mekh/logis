const errors = require('../src/common/errors');
const { Config } = require('../src/config');
const loglevel = require('../src/logger/loglevel');

describe('# Config', () => {
  beforeEach(() => {
    process.env.LOG_LEVEL = '';
  });

  it('format - should have the format property', () => {
    expect(Config.format).toBe(undefined);
  });

  it('limit - should keep the storage limit property', () => {
    expect(Config.storageLimit).toBe(100);
  });

  it('logLevel - should return the default log level', () => {
    expect(Config.loglevel).toBe('info');
  });

  it('logLevel - should user getter for the defaultLogLevel', () => {
    process.env.LOG_LEVEL = 'trace';
    expect(Config.loglevel).toBe('trace');
  });

  it('logLevel - should use lower case for process.env', () => {
    process.env.LOG_LEVEL = 'INFO';
    expect(Config.loglevel).toBe('info');
  });

  it('logLevel - should override process.env', () => {
    process.env.LOG_LEVEL = 'debug';
    const spy = jest.spyOn(loglevel, 'assertLogLevel');
    Config.loglevel = 'error';

    expect(spy).toBeCalledWith('error');
    expect(Config.loglevel).toBe('error');

    spy.mockClear();
  });

  it('logLevel - should use lower case for the default log level', () => {
    Config.loglevel = 'WARN';
    expect(Config.loglevel).toBe('warn');
  });

  it('colorize - should return false by default', () => {
    expect(Config.colorize).toBe(false);
  });

  it('colorize - should return false if LOG_COLORS is not true', () => {
    process.env.LOG_COLORS = 'false';
    expect(Config.colorize).toBe(false);
  });

  it('colorize - should return true if LOG_COLORS is true', () => {
    process.env.LOG_COLORS = 'true';
    expect(Config.colorize).toBe(true);
  });

  it('colorize - should throw if a value is not of boolean type', () => {
    expect(() => { Config.colorize = 'a'; }).toThrow(errors.invalidTypeBool);
  });

  it('colorize - should store the default colorize option', () => {
    process.env.LOG_COLORS = 'false';
    Config.colorize = true;
    expect(Config.colorize).toBe(true);
  });

  it('timestamp - should throw if a value is not of boolean type', () => {
    expect(() => { Config.timestamp = 'a'; }).toThrow(errors.invalidTypeBool);
  });
});
