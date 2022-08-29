const { Config } = require('../src/config');

describe('# Configure', () => {
  it('should use default values', () => {
    Config.configure({ loglevel: 'debug' });

    expect(Config.loglevel).toBe('debug');
    expect(Config.colorize).toBe(false);
    expect(Config.timestamp).toBe(true);
    expect(Config.format).toBe(undefined);
  });

  it('should reassign the default values', () => {
    const formatter = jest.fn();
    Config.configure({ loglevel: 'trace', colorize: true, format: formatter, timestamp: false });

    expect(Config.loglevel).toBe('trace');
    expect(Config.colorize).toBe(true);
    expect(Config.timestamp).toBe(false);
    expect(Config.format).toBe(formatter);
  });
});
