// tests/unit/fragment.test.js

const { Fragment } = require('../../src/model/fragment');
const memoryDb = require('../../src/model/data/memory');

const fragmentData = { id: 'fragment1', ownerId: 'owner1', type: 'text/plain', size: 0 };

jest.mock('../../src/model/data/memory', () => ({
  ...jest.requireActual('../../src/model/data/memory'),
  listFragments: jest.fn(),
  writeFragment: jest.fn(),
  readFragment: jest.fn(),
  writeFragmentData: jest.fn(),
  readFragmentData: jest.fn(),
  deleteFragment: jest.fn(),
}));

describe('Fragment class', () => {
  test('should create a Fragment instance', () => {
    const fragment = new Fragment(fragmentData);
    expect(fragment).toBeInstanceOf(Fragment);
  });

  test('save() should store fragment', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.writeFragment.mockResolvedValueOnce();
    await fragment.save();
    expect(memoryDb.writeFragment).toHaveBeenCalledWith(
      fragmentData.ownerId,
      fragmentData.id,
      expect.objectContaining({
        id: fragmentData.id,
        ownerId: fragmentData.ownerId,
        type: fragmentData.type,
        size: fragmentData.size,
        created: expect.any(String),
        updated: expect.any(String),
      })
    );
  });

  test('save() should throw an error if write fails', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.writeFragment.mockRejectedValueOnce(new Error('Test error'));
    await expect(fragment.save()).rejects.toThrow('Test error');
  });

  test('getData() should retrieve fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.readFragmentData.mockResolvedValueOnce(Buffer.from('test data'));
    const data = await fragment.getData();
    expect(data).toEqual(Buffer.from('test data'));
  });

  test('getData() should throw an error if read fails', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.readFragmentData.mockRejectedValueOnce(new Error('Test error'));
    await expect(fragment.getData()).rejects.toThrow('Test error');
  });

  test('setData() should update fragment data', async () => {
    const fragment = new Fragment(fragmentData);
    const newData = Buffer.from('new data');
    memoryDb.writeFragmentData.mockResolvedValueOnce();
    await fragment.setData(newData);
    expect(memoryDb.writeFragmentData).toHaveBeenCalledWith(
      fragmentData.ownerId,
      fragmentData.id,
      newData
    );
  });

  test('byId() should retrieve fragment by id', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.readFragment.mockResolvedValueOnce(fragmentData);
    const retrievedFragment = await Fragment.byId(fragment.ownerId, fragment.id);
    expect(retrievedFragment).toEqual(fragment);
  });

  test('delete() should delete fragment by id', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.deleteFragment.mockResolvedValueOnce();
    await Fragment.delete(fragment.ownerId, fragment.id);
    expect(memoryDb.deleteFragment).toHaveBeenCalledWith(fragment.ownerId, fragment.id);
  });

  test('delete() should throw an error if delete fails', async () => {
    const fragment = new Fragment(fragmentData);
    memoryDb.deleteFragment.mockRejectedValueOnce(new Error('Test error'));
    await expect(Fragment.delete(fragment.ownerId, fragment.id)).rejects.toThrow('Test error');
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

  test('isSupportedType() should return true for supported type', () => {
    const isSupported = Fragment.isSupportedType('text/plain');
    expect(isSupported).toBe(true);
  });

  test('isSupportedType() should return false for unsupported type', () => {
    const isSupported = Fragment.isSupportedType('image/png');
    expect(isSupported).toBe(false);
  });

  test('byId() should throw an error if fragment is not found', async () => {
    memoryDb.readFragment.mockResolvedValueOnce(undefined);
    await expect(Fragment.byId('nonexistent-owner', 'nonexistent-id')).rejects.toThrow(
      'fragment not found'
    );
  });

  test('byUser() should handle errors gracefully', async () => {
    memoryDb.listFragments.mockRejectedValueOnce(new Error('Test error'));
    await expect(Fragment.byUser('owner1')).rejects.toThrow('Error fetching fragments by user');
  });
});
