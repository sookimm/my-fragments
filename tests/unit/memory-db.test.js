const memoryDB = require('../../src/model/data/memory/memory-db');

describe('MemoryDB', () => {
  const ownerId = 'testOwner';
  const id = 'testId';
  const fragment = { id, ownerId, type: 'text/plain', size: 100 };
  const data = Buffer.from('Hello, world!');

  test('writeFragment and readFragment', async () => {
    await memoryDB.writeFragment(ownerId, id, fragment);
    const readFragment = await memoryDB.readFragment(ownerId, id);
    expect(readFragment).toEqual(fragment);
  });

  test('writeFragmentData and readFragmentData', async () => {
    await memoryDB.writeFragmentData(ownerId, id, data);
    const readData = await memoryDB.readFragmentData(ownerId, id);
    expect(readData).toEqual(data);
  });
});
