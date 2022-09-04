const { Loglevel } = require('../src/logger/loglevel');
const { DEFAULT_LOG_LEVELS } = require('../src/constants');

const loglevel = Loglevel.create();

describe('# Loglevel', () => {
  it('should create an instance with custom levels', () => {
    const levels = ['abc'];
    const instance = Loglevel.create({ levels });

    expect(instance.levels).toBe(levels);
  });

  it('should create an instance with default levels', () => {
    const instance = Loglevel.create();

    expect(instance.levels).toBe(DEFAULT_LOG_LEVELS);
  });

  it('should create an instance with default levels is an empty object', () => {
    const instance = Loglevel.create({});

    expect(instance.levels).toBe(DEFAULT_LOG_LEVELS);
  });

  it('hasLevel - should return true', () => {
    expect(loglevel.isValid('error')).toBe(true);
    expect(loglevel.isValid('warn')).toBe(true);
    expect(loglevel.isValid('info')).toBe(true);
    expect(loglevel.isValid('debug')).toBe(true);
    expect(loglevel.isValid('trace')).toBe(true);
  });

  it('isValid - should return false', () => {
    expect(loglevel.isValid('xyz')).toBe(false);
  });

  it('isValid - should handle undefined', () => {
    expect(loglevel.isValid()).toBe(false);
  });

  it('isValidLevel - should return false', () => {
    expect(loglevel.isValid()).toBe(false);
    expect(loglevel.isValid(1)).toBe(false);
    expect(loglevel.isValid(null)).toBe(false);
    expect(loglevel.isValid('xyz')).toBe(false);
  });

  it('isValid - should return true', () => {
    expect(loglevel.isValid('error')).toBe(true);
    expect(loglevel.isValid('warn')).toBe(true);
    expect(loglevel.isValid('info')).toBe(true);
    expect(loglevel.isValid('debug')).toBe(true);
    expect(loglevel.isValid('trace')).toBe(true);
  });

  it('assertLogLevel - should throw', () => {
    expect(() => loglevel.assertLevel()).toThrow();
    expect(() => loglevel.assertLevel(1)).toThrow();
    expect(() => loglevel.assertLevel(null)).toThrow();
    expect(() => loglevel.assertLevel('xyz')).toThrow();
  });

  it('assertLevel - should not throw', () => {
    expect(() => loglevel.assertLevel('error')).not.toThrow();
    expect(() => loglevel.assertLevel('warn')).not.toThrow();
    expect(() => loglevel.assertLevel('info')).not.toThrow();
    expect(() => loglevel.assertLevel('debug')).not.toThrow();
    expect(() => loglevel.assertLevel('trace')).not.toThrow();
  });
});
