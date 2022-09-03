const { Config } = require('../src/config');

describe('# Configure', () => {
  it('should use default values', () => {
    Config.setGlobalConfig({ loglevel: 'debug' });

    expect(Config.loglevel).toBe('debug');
    expect(Config.colorize).toBe(false);
    expect(Config.format).toBe(undefined);
  });

  it('should reassign the default values', () => {
    const formatter = jest.fn();
    Config.setGlobalConfig({ loglevel: 'trace', colorize: true, format: formatter });

    expect(Config.loglevel).toBe('trace');
    expect(Config.colorize).toBe(true);
    expect(Config.format).toBe(formatter);
  });
});
