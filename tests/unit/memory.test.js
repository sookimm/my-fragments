// tests/unit/memory.test.js

const memory = require('../../src/model/data/memory/memory-db');

describe('Memory Data Model', () => {
  const ownerId = 'testOwner';
  const id = 'testId';
  const fragment = { id, ownerId, size: 100, type: 'text/plain' };
  const data = Buffer.from('Hello, world!');

  test('writeFragment and readFragment', async () => {
    await memory.writeFragment(ownerId, fragment);
    const readFragment = await memory.readFragment(ownerId, id);
    expect(readFragment).toEqual(fragment);
  });

  test('writeFragmentData and readFragmentData', async () => {
    await memory.writeFragment(ownerId, fragment);
    await memory.writeFragmentData(ownerId, id, data);
    const readData = await memory.readFragmentData(ownerId, id);
    expect(readData).toEqual(data);
  });
});
