// tests/unit/memory-db.test.js

const memoryDb = require('../../src/model/data/memory');
const MemoryDB = require('../../src/model/data/memory/memory-db');

// Test data
const ownerId = 'testOwner';
const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
const data = Buffer.from('Hello, world!');

describe('Memory Database', () => {
  let db;

  beforeEach(() => {
    db = new MemoryDB();
  });

  test('writeFragment() should store fragment', async () => {
    const result = await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    expect(result).toEqual(fragment);
  });

  test('readFragment() should retrieve stored fragment', async () => {
    await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    const result = await memoryDb.readFragment(ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('readFragmentData() should retrieve fragment data', async () => {
    await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    await memoryDb.writeFragmentData(ownerId, fragment.id, data);
    const result = await memoryDb.readFragmentData(ownerId, fragment.id);
    expect(result).toEqual(data);
  });

  test('writeFragmentData() should update fragment data', async () => {
    await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    const newData = Buffer.from('new data');
    await memoryDb.writeFragmentData(ownerId, fragment.id, newData);
    const result = await memoryDb.readFragmentData(ownerId, fragment.id);
    expect(result).toEqual(newData);
  });

  test('put() should store entry correctly', async () => {
    await db.put('primaryKey', 'secondaryKey', { value: 'test' });
    const result = await db.get('primaryKey', 'secondaryKey');
    expect(result).toEqual({ value: 'test' });
  });

  test('get() should throw error if primaryKey or secondaryKey is not a string', async () => {
    await expect(db.get(123, 'secondaryKey')).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=123, secondaryKey=secondaryKey'
    );
    await expect(db.get('primaryKey', 123)).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=primaryKey, secondaryKey=123'
    );
  });

  test('put() should throw error if primaryKey or secondaryKey is not a string', async () => {
    await expect(db.put(123, 'secondaryKey', {})).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=123, secondaryKey=secondaryKey'
    );
    await expect(db.put('primaryKey', 123, {})).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=primaryKey, secondaryKey=123'
    );
  });

  test('query() should return all entries for a primary key', async () => {
    await db.put('primaryKey', 'secondaryKey1', { value: 'test1' });
    await db.put('primaryKey', 'secondaryKey2', { value: 'test2' });
    const result = await db.query('primaryKey');
    expect(result).toEqual([{ value: 'test1' }, { value: 'test2' }]);
  });

  test('query() should throw error if primaryKey is not a string', async () => {
    await expect(db.query(123)).rejects.toThrow(
      'primaryKey string is required, got primaryKey=123'
    );
  });

  test('del() should delete entry correctly', async () => {
    await db.put('primaryKey', 'secondaryKey', { value: 'test' });
    await db.del('primaryKey', 'secondaryKey');
    const result = await db.get('primaryKey', 'secondaryKey');
    expect(result).toBeUndefined();
  });

  test('del() should throw error if primaryKey or secondaryKey is not a string', async () => {
    await expect(db.del(123, 'secondaryKey')).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=123, secondaryKey=secondaryKey'
    );
    await expect(db.del('primaryKey', 123)).rejects.toThrow(
      'primaryKey and secondaryKey strings are required, got primaryKey=primaryKey, secondaryKey=123'
    );
  });

  test('del() should throw error if entry does not exist', async () => {
    await expect(db.del('primaryKey', 'nonexistent')).rejects.toThrow(
      'missing entry for primaryKey=primaryKey and secondaryKey=nonexistent'
    );
  });
});
