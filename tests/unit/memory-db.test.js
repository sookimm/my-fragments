// test/unit/memory-db.test.js

const memoryDb = require('../../src/model/data/memory/memory-db');

describe('Memory Database', () => {
  const ownerId = 'owner1';
  const fragment = { id: 'fragment1', data: Buffer.from('test data') };

  test('writeFragment() should store fragment', async () => {
    const result = await memoryDb.writeFragment(ownerId, fragment);
    expect(result).toEqual(fragment);
  });

  test('readFragment() should retrieve stored fragment', async () => {
    await memoryDb.writeFragment(ownerId, fragment);
    const result = await memoryDb.readFragment(ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('readFragmentData() should retrieve fragment data', async () => {
    await memoryDb.writeFragment(ownerId, fragment);
    const result = await memoryDb.readFragmentData(ownerId, fragment.id);
    expect(result).toEqual(fragment.data);
  });

  test('writeFragmentData() should update fragment data', async () => {
    await memoryDb.writeFragment(ownerId, fragment);
    const newData = Buffer.from('new data');
    await memoryDb.writeFragmentData(ownerId, fragment.id, newData);
    const result = await memoryDb.readFragmentData(ownerId, fragment.id);
    expect(result).toEqual(newData);
  });
});
