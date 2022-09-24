const { Message } = require('../src/logger/message');

describe('# Message', () => {
  it('should have properties', () => {
    const settings = {
      data: [],
      level: 'level',
      category: 'category',
      callsite: {
        fileName: 'file',
        functionName: 'fn',
        lineNumber: 1,
      },
    };

    const message = new Message(settings);

    expect(message.date).toBeInstanceOf(Date);
    expect(message.pid).toBe(process.pid);
    expect(message.data).toBe(settings.data);
    expect(message.level).toBe(settings.level);
    expect(message.category).toBe(settings.category);
    expect(message.fileName).toBe(settings.callsite.fileName);
    expect(message.functionName).toBe(settings.callsite.functionName);
    expect(message.lineNumber).toBe(settings.callsite.lineNumber);
    expect(message.text).toBe('');
  });
});
