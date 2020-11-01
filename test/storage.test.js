const { addLogger, getLogger } = require('../src/utils/storage');

describe('# Storage', () => {
  it('should throw', () => {
    expect(() => addLogger(1)).toThrow();
  });

  it('should return a stored logger', () => {
    const category = 'ABC';
    const logger = { category: 'ABC', prop: 123 };

    addLogger(category, logger);
    addLogger(category, logger);
    expect(getLogger(category)).toBe(logger);
  });
});
