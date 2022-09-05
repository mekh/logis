const { Storage } = require('../src/utils/storage');

const limit = 10;

describe('# Storage', () => {
  let storage;
  beforeEach(() => {
    storage = new Storage({ limit });
  });

  it('should add a new item', () => {
    storage.add(123);
    storage.add(321);

    expect(storage.storage).toHaveLength(2);
    expect(storage.storage[0]).toBe(123);
    expect(storage.storage[1]).toBe(321);
  });

  it('should find objects', () => {
    const item1 = { a: 1, b: 2, c: 3, d: 4 };
    const item2 = { a: 1, b: 2, c: 33, d: 44 };
    const item3 = { a: 1, b: 22, c: 33, d: 55 };
    const item4 = { a: 11, b: 22, c: 33, d: 55 };

    storage.add(item1);
    storage.add(item2);
    storage.add(item3);
    storage.add(item4);

    expect(storage.find({ a: 1 })).toStrictEqual([item1, item2, item3]);
    expect(storage.find({ c: 33 })).toStrictEqual([item2, item3, item4]);
    expect(storage.find({ a: 1, b: 2 })).toStrictEqual([item1, item2]);
    expect(storage.find({ a: 11, b: 22, c: 33 })).toStrictEqual([item4]);
    expect(storage.find({ a: 11, b: 22, c: 33, d: 999, e: null })).toStrictEqual([]);
  });

  it('should find plain', () => {
    const item1 = 1;
    const item2 = 'x';
    const item4 = null;
    const item5 = undefined;

    storage.add(item1);
    storage.add(item2);
    storage.add(item4);
    storage.add(item5);

    expect(storage.find(item1)).toStrictEqual([item1]);
    expect(storage.find([item2])).toStrictEqual([item2]);
    expect(storage.find(item4)).toStrictEqual([item4]);
    expect(storage.find([item5])).toStrictEqual([item5]);
  });
});
