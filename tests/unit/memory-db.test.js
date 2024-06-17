// test/unit/memory-db.test.js

const memoryDb = require('../../src/model/data/memory');

// Test data
const ownerId = 'testOwner';
const fragment = { id: 'testId', ownerId, size: 100, type: 'text/plain' };
const data = Buffer.from('Hello, world!');

describe('Memory Database', () => {
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
});
