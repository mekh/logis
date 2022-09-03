const loglevel = require('../src/logger/loglevel');

describe('# Loglevel', () => {
  it('hasLevel - should return true', () => {
    expect(loglevel.hasLevel('error')).toBe(true);
    expect(loglevel.hasLevel('warn')).toBe(true);
    expect(loglevel.hasLevel('info')).toBe(true);
    expect(loglevel.hasLevel('debug')).toBe(true);
    expect(loglevel.hasLevel('trace')).toBe(true);
  });

  it('hasLevel - should return false', () => {
    expect(loglevel.hasLevel('xyz')).toBe(false);
  });

  it('hasLevel - should handle undefined', () => {
    expect(loglevel.hasLevel()).toBe(false);
  });

  it('isValidLevel - should return false', () => {
    expect(loglevel.isValidLevel()).toBe(false);
    expect(loglevel.isValidLevel(1)).toBe(false);
    expect(loglevel.isValidLevel(null)).toBe(false);
    expect(loglevel.isValidLevel('xyz')).toBe(false);
  });

  it('isValidLevel - should return true', () => {
    expect(loglevel.isValidLevel('error')).toBe(true);
    expect(loglevel.isValidLevel('warn')).toBe(true);
    expect(loglevel.isValidLevel('info')).toBe(true);
    expect(loglevel.isValidLevel('debug')).toBe(true);
    expect(loglevel.isValidLevel('trace')).toBe(true);
  });

  it('assertLogLevel - should throw', () => {
    expect(() => loglevel.assertLogLevel()).toThrow();
    expect(() => loglevel.assertLogLevel(1)).toThrow();
    expect(() => loglevel.assertLogLevel(null)).toThrow();
    expect(() => loglevel.assertLogLevel('xyz')).toThrow();
  });

  it('assertLogLevel - should not throw', () => {
    expect(() => loglevel.assertLogLevel('error')).not.toThrow();
    expect(() => loglevel.assertLogLevel('warn')).not.toThrow();
    expect(() => loglevel.assertLogLevel('info')).not.toThrow();
    expect(() => loglevel.assertLogLevel('debug')).not.toThrow();
    expect(() => loglevel.assertLogLevel('trace')).not.toThrow();
  });
});
