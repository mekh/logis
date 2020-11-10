const { config, configure } = require('../src/config');
const { format } = require('../src/logger/format');

jest.mock('../src/config/config');

describe('# Configure', () => {
  it('should use default values', () => {
    configure({ loglevel: 'abc' });

    expect(config.defaultLogLevel).toBe('abc');
    expect(config.useColors).toBe(false);
    expect(config.timestamp).toBe(true);
    expect(config.format).toBe(format);
  });

  it('should reassign the default values', () => {
    const formatter = jest.fn();
    configure({ loglevel: 'xyz', colorize: true, format: formatter, timestamp: false });

    expect(config.defaultLogLevel).toBe('xyz');
    expect(config.useColors).toBe(true);
    expect(config.timestamp).toBe(false);
    expect(config.format).toBe(formatter);
  });
});
