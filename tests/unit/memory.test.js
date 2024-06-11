const memory = require('../../src/model/data/memory');

describe('Memory Data Model', () => {
  const ownerId = 'testOwner';
  const id = 'testId';
  const fragment = { id, ownerId, type: 'text/plain', size: 100 };
  const data = Buffer.from('Hello, world!');

  test('writeFragment and readFragment', async () => {
    await memory.writeFragment(ownerId, id, fragment);
    const readFragment = await memory.readFragment(ownerId, id);
    expect(readFragment).toEqual(fragment);
  });

  test('writeFragmentData and readFragmentData', async () => {
    await memory.writeFragmentData(ownerId, id, data);
    const readData = await memory.readFragmentData(ownerId, id);
    expect(readData).toEqual(data);
  });
});
