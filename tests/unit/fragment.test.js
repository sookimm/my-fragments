// tests/unit/fragment.test.js

const { Fragment } = require('../../src/model/fragment');
const memoryDb = require('../../src/model/data/memory');

const fragmentData = { id: 'fragment1', ownerId: 'owner1', type: 'text/plain', size: 0 };

jest.mock('../../src/model/data/memory', () => ({
  ...jest.requireActual('../../src/model/data/memory'),
  listFragments: jest.fn(),
}));

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
    memoryDb.listFragments.mockResolvedValueOnce([
      fragmentData,
      { ...fragmentData, id: 'fragment2' },
    ]);
    const fragments = await Fragment.byUser(fragmentData.ownerId);
    expect(fragments).toEqual([
      expect.objectContaining({
        id: fragmentData.id,
        ownerId: fragmentData.ownerId,
        type: fragmentData.type,
        size: fragmentData.size,
      }),
      expect.objectContaining({
        id: 'fragment2',
        ownerId: fragmentData.ownerId,
        type: fragmentData.type,
        size: fragmentData.size,
      }),
    ]);
  });

  test('constructor should throw an error if ownerId or type is missing', () => {
    expect(() => new Fragment({ type: 'text/plain' })).toThrow('ownerId and type are required');
    expect(() => new Fragment({ ownerId: 'owner1' })).toThrow('ownerId and type are required');
  });

  test('isSupportedType() should return false for unsupported type', () => {
    const isSupported = Fragment.isSupportedType('image/png');
    expect(isSupported).toBe(false);
  });

  test('byId() should throw an error if fragment is not found', async () => {
    await expect(Fragment.byId('nonexistent-owner', 'nonexistent-id')).rejects.toThrow(
      'fragment not found'
    );
  });

  test('byUser() should handle errors gracefully', async () => {
    memoryDb.listFragments.mockRejectedValueOnce(new Error('Test error'));
    await expect(Fragment.byUser('owner1')).rejects.toThrow('Error fetching fragments by user');
  });
});
