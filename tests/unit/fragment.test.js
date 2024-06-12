// tests/unit/fragment.test.js

const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory/memory-db');
const Fragment = require('../../src/model/fragment');

describe('Fragment', () => {
  const fragmentData = { id: 'fragment1', ownerId: 'owner1', data: Buffer.from('test data') };

  test('should create a Fragment instance', () => {
    const fragment = new Fragment(fragmentData);
    expect(fragment).toBeInstanceOf(Fragment);
  });

  test('save() should store fragment', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const storedFragment = await Fragment.read(fragment.id, fragment.ownerId);
    expect(storedFragment).toEqual(fragment);
  });

  test('getData() should retrieve fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const data = await fragment.getData();
    expect(data).toEqual(fragmentData.data);
  });

  test('setData() should update fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const newData = Buffer.from('new data');
    await fragment.setData(newData);
    const updatedData = await fragment.getData();
    expect(updatedData).toEqual(newData);
  });
});
