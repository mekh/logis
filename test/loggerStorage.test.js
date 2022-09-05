const { LoggerStorage } = require('../src/logger/storage');

describe('# Storage', () => {
  let storage;

  beforeEach(() => {
    storage = new LoggerStorage();
  });
  it('should throw', () => {
    expect(() => storage.addLogger({ category: 1 })).toThrow();
  });

  it('should handle string category', () => {
    expect(() => storage.addLogger({ category: 'abc' })).not.toThrow();
  });

  it('should handle symbol category', () => {
    expect(() => storage.addLogger({ category: Symbol('abc') })).not.toThrow();
  });

  it('should return a stored logger', () => {
    const category = 'ABC';
    const logger = { category: 'ABC', prop: 123 };

    storage.addLogger({ category, logger });
    storage.addLogger({ category, logger });
    expect(storage.getLogger({ category })).toBe(logger);
  });
});
