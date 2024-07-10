// tests/unit/memory-db.test.js

const memoryDb = require('../../src/model/data/memory');
const MemoryDB = require('../../src/model/data/memory/memory-db');

// Test data
const ownerId = 'testOwner';

describe('Memory Database', () => {
  let db;

  beforeEach(() => {
    db = new MemoryDB();
  });

  test('writeFragment() should store fragment', async () => {
    const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
    const result = await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    expect(result).toEqual(fragment);
  });

  test('readFragment() should retrieve stored fragment', async () => {
    const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
    await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    const result = await memoryDb.readFragment(ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('readFragmentData() should retrieve fragment data', async () => {
    const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
    const data = Buffer.from('Hello, world!');
    await memoryDb.writeFragment(ownerId, fragment.id, fragment);
    await memoryDb.writeFragmentData(ownerId, fragment.id, data);
    const result = await memoryDb.readFragmentData(ownerId, fragment.id);
    expect(result).toEqual(data);
  });

  test('writeFragmentData() should update fragment data', async () => {
    const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
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

  test('query() should return all entries for a primary key', async () => {
    await db.put('primaryKey', 'secondaryKey1', { value: 'test1' });
    await db.put('primaryKey', 'secondaryKey2', { value: 'test2' });
    const result = await db.query('primaryKey');
    expect(result).toEqual([{ value: 'test1' }, { value: 'test2' }]);
  });
});
