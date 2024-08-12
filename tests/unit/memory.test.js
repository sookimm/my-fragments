const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('readFragment() test', async () => {
    const data = { fragment: 'test', id: '1', ownerId: 'abc' };
    await writeFragment(data);
    const result = await readFragment('abc', '1');
    expect(result).toBe(data);
  });

  test('writeFragment() test', async () => {
    const data = { fragment: 'test', id: '1', ownerId: 'abc' };
    const result = await writeFragment(data);
    expect(result).toBe(undefined);
  });

  test('readFragmentData() test', async () => {
    const data = 'test';
    await writeFragmentData('abc', '1', data);
    const result = await readFragmentData('abc', '1');
    expect(result).toBe(data);
  });

  test('writeFragmentData() test', async () => {
    const data = 'test';
    const result = await writeFragmentData('abc', '1', data);
    expect(result).toBe(undefined);
  });

  test('listFragments() test', async () => {
    const data = { fragment: 'test', id: '1', ownerId: 'abc' };
    const data2 = { fragment: 'test', id: '2', ownerId: 'abc' };
    await writeFragment(data);
    await writeFragment(data2);
    const result = await listFragments('abc');
    expect(result).toStrictEqual(['1', '2']);
  });

  test('deleteFragment() test', async () => {
    const data = { ownerId: 'abc', id: '1' };
    await writeFragmentData(data.ownerId, data.id, 'test');
    await writeFragment(data);
    const result1 = await readFragment(data.ownerId, data.id);
    expect(result1).toBe(data);
    await deleteFragment(data.ownerId, data.id);
    const result2 = await readFragment(data.ownerId, data.id);
    expect(result2).toBe(undefined);
  });
});
