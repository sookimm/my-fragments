// tests/unit/fragment.test.js

const { Fragment } = require('../../src/model/fragment');
const memoryDb = require('../../src/model/data/memory');

const fragmentData = { id: 'fragment1', ownerId: 'owner1', type: 'text/plain', size: 0 };

describe('Fragment class', () => {
  test('should create a Fragment instance', () => {
    const fragment = new Fragment(fragmentData);
    expect(fragment).toBeInstanceOf(Fragment);
  });

  test('save() should store fragment', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const storedFragment = await Fragment.byId(fragment.ownerId, fragment.id);
    expect(storedFragment).toEqual(fragment);
  });

  test('getData() should retrieve fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    await fragment.setData(Buffer.from('test data'));
    const data = await fragment.getData();
    expect(data).toEqual(Buffer.from('test data'));
  });

  test('setData() should update fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const newData = Buffer.from('new data');
    await fragment.setData(newData);
    const updatedData = await fragment.getData();
    expect(updatedData).toEqual(newData);
  });

  test('byId() should retrieve fragment by id', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    const retrievedFragment = await Fragment.byId(fragment.ownerId, fragment.id);
    expect(retrievedFragment).toEqual(fragment);
  });

  test('delete() should delete fragment by id', async () => {
    const fragment = new Fragment(fragmentData);
    await fragment.save();
    await Fragment.delete(fragment.ownerId, fragment.id);
    const retrievedFragment = await memoryDb.readFragment(fragment.ownerId, fragment.id);
    expect(retrievedFragment).toBeUndefined();
  });

  test('byUser() should retrieve fragments by user', async () => {
    const fragment1 = new Fragment(fragmentData);
    const fragment2 = new Fragment({ ...fragmentData, id: 'fragment2' });
    await fragment1.save();
    await fragment2.save();
    const fragments = await Fragment.byUser(fragment1.ownerId);
    expect(fragments).toEqual([
      expect.objectContaining({
        id: fragment1.id,
        ownerId: fragment1.ownerId,
        type: fragment1.type,
        size: fragment1.size,
      }),
      expect.objectContaining({
        id: fragment2.id,
        ownerId: fragment2.ownerId,
        type: fragment2.type,
        size: fragment2.size,
      }),
    ]);
  });
});
