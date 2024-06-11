// tests/unit/fragment.test.js

const Fragment = require('../../src/model/fragment');

describe('Fragment Model', () => {
  const ownerId = 'testOwner';
  const id = 'testId';
  const type = 'text/plain';
  const data = Buffer.from('Hello, world!');

  let fragment;

  beforeEach(() => {
    fragment = new Fragment(ownerId, data, type);
  });

  test('should create a fragment instance', () => {
    expect(fragment).toBeInstanceOf(Fragment);
    expect(fragment.ownerId).toBe(ownerId);
    expect(fragment.type).toBe(type);
    expect(fragment.size).toBe(data.length);
  });

  test('should save and read fragment', async () => {
    await fragment.save();
    const savedFragment = await Fragment.find(ownerId, fragment.id);
    expect(savedFragment).toEqual(fragment);
  });

  test('should read and write fragment data', async () => {
    await fragment.save();
    const savedFragment = await Fragment.find(ownerId, fragment.id);
    const fragmentData = await savedFragment.getData();
    expect(fragmentData).toEqual(data);
  });

  test('should throw error for unsupported type', () => {
    expect(() => {
      new Fragment(ownerId, data, 'unsupported/type');
    }).toThrow('Unsupported type: unsupported/type');
  });
});
