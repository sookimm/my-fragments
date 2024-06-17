// tests/unit/fragment.test.js

const { Fragment } = require('../../src/model/fragment');

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
});
