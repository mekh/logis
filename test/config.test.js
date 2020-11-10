const errors = require('../src/common/errors');
const { config } = require('../src/config');
const { assertLogLevel } = require('../src/logger/loglevel');
const { format } = require('../src/logger/format');

jest.mock('../src/logger/loglevel');
jest.mock('../src/logger/format');

describe('# Config', () => {
  it('format - should have the format property', () => {
    expect(config.format).toBe(format);
  });

  it('limit - should keep the storage limit property', () => {
    expect(config.storageLimit).toBe(100);
  });

  it('logLevel - should return the default log level', () => {
    expect(config.defaultLogLevel).toBe('info');
  });

  it('logLevel - should user getter for the defaultLogLevel', () => {
    process.env.LOG_LEVEL = 'trace';
    expect(config.defaultLogLevel).toBe('trace');
  });

  it('logLevel - should use lower case for process.env', () => {
    process.env.LOG_LEVEL = 'INFO';
    expect(config.defaultLogLevel).toBe('info');
  });

  it('logLevel - should store the default log level', () => {
    process.env.LOG_LEVEL = 'debug';
    config.defaultLogLevel = 'error';

    expect(assertLogLevel).toBeCalledWith('error');
    expect(config.defaultLogLevel).toBe('error');
  });

  it('logLevel - should use lower case for the default log level', () => {
    config.defaultLogLevel = 'WARN';
    expect(config.defaultLogLevel).toBe('warn');
  });

  it('colorize - should return false by default', () => {
    expect(config.useColors).toBe(false);
  });

  it('colorize - should return false if LOG_COLORS is not true', () => {
    process.env.LOG_COLORS = 'false';
    expect(config.useColors).toBe(false);
  });

  it('colorize - should return true if LOG_COLORS is true', () => {
    process.env.LOG_COLORS = 'true';
    expect(config.useColors).toBe(true);
  });

  it('colorize - should throw if a value is not of boolean type', () => {
    expect(() => { config.useColors = 'a'; }).toThrow(errors.invalidTypeBool);
  });

  it('colorize - should store the default colorize option', () => {
    process.env.LOG_COLORS = 'false';
    config.useColors = true;
    expect(config.useColors).toBe(true);
  });

  it('timestamp - should throw if a value is not of boolean type', () => {
    expect(() => { config.timestamp = 'a'; }).toThrow(errors.invalidTypeBool);
  });
});
