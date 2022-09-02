const formatters = require('../src/formatter');
const { Parser } = require('../src/parser/parser');
const { Primitives } = require('../src/parser/primitives');
const { Logline } = require('../src/formatter/logline');

describe('# Formatters', () => {
  it('defaults', () => {
    expect(formatters.Logline).toBe(Logline);
    expect(formatters.Primitives).toBe(Primitives);
    expect(formatters.Parser).toBe(Parser);
    expect(formatters.defaults).toBeDefined();
    expect(formatters.defaults.loglineJson).toBeInstanceOf(Logline);
    expect(formatters.defaults.logline).toBeInstanceOf(Logline);
    expect(formatters.defaults.primitives).toBeInstanceOf(Primitives);
  });

  it('logline - default number of formatters', () => {
    expect(formatters.defaults.logline.formatters).toHaveLength(6);
    expect(formatters.defaults.loglineJson.formatters).toHaveLength(8);
  });

  it('primitives - default number of formatters', () => {
    expect(formatters.defaults.primitives.primitives).toHaveLength(5);
  });

  it('logline - default format', () => {
    const message = {
      date: new Date(),
      level: 'level',
      pid: 999,
      category: 'cat',
      fileName: 'file',
      functionName: 'fn',
      lineNumber: 99,
      text: ['data'],
    };

    const dateISO = message.date.toISOString();
    const resultStr = formatters.defaults.logline.build(message);
    const resultJson = formatters.defaults.loglineJson.build(message);

    expect(resultStr).toBe(`[${dateISO}] [LEVEL] [999] [cat] [file||fn:99] data`);
    expect(resultJson).toBe(JSON.stringify({
      date: dateISO,
      level: 'level',
      pid: 999,
      category: 'cat',
      filename: 'file',
      function: 'fn',
      line: 99,
      data: ['data'],
    }));
  });

  it('logline json - defaults', () => {
    const message = {
      date: new Date(),
      level: 'abc',
      lineNumber: undefined,
      functionName: undefined,
    };

    const dateISO = message.date.toISOString();
    const resultStr = formatters.defaults.logline.build(message);
    const resultJson = formatters.defaults.loglineJson.build(message);

    expect(resultStr).toBe(`[${dateISO}] [ABC] [undefined] [undefined] [undefined||-:-1] undefined`);
    expect(resultJson).toBe(JSON.stringify({
      date: dateISO,
      level: 'abc',
      function: '-',
      line: -1,
    }));
  });

  it('primitives', () => {
    const { primitives } = formatters.defaults;
    const date = new Date();
    const namedArrowFn = () => {};

    // eslint-disable-next-line prefer-arrow-callback
    expect(primitives.apply(function namedFn() {})).toBe('<Function namedFn>');
    expect(primitives.apply(namedArrowFn)).toBe('<Function namedArrowFn>');
    expect(primitives.apply(() => {})).toBe('<Function anonymous>');
    expect(primitives.apply(date)).toBe(date.toISOString());
    expect(primitives.apply(new Promise(res => { res(); }))).toBe('<Promise>');
    expect(primitives.apply(new Error())).toEqual(expect.any(String));
    expect(primitives.apply(Buffer.from('buf'))).toBe('buf');
  });
});
