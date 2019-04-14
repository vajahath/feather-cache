import { verifyOptions } from '../src/verify-options';
import { IFeatherCacheDriver } from '../src/feather-cache-driver.interface';
import { FeatherCache } from '../src';

/**
 * testing main fns (get)
 */
describe('testing FeatherCache main get', () => {
  let featherStore: FeatherCache;
  beforeAll(() => {
    featherStore = new FeatherCache();
  });

  test('testing set fn --> get fn', async () => {
    await featherStore.set('hua', 'hiya');
    expect(await featherStore.get('hua')).toBe('hiya');
  });

  test('testing set fn with number', async () => {
    await featherStore.set('121', 121);
    expect(await featherStore.get('121')).toBe(121);
  });

  test('testing get fn with a non-existing entry', async () => {
    expect(await featherStore.get('lo-lo')).toBeNull();
  });

  test('setFn --> getFn --> delFn --> getFn', async () => {
    await featherStore.set('7878', 7878);
    expect(await featherStore.get('7878')).toBe(7878);
    await featherStore.del('7878');
    expect(await featherStore.get('7878')).toBeNull();
  });
});

/**
 * testing main fns (fetch)
 */
describe('testing FeatherCache main fetch', () => {
  let featherStore: FeatherCache;
  beforeAll(() => {
    featherStore = new FeatherCache({
      maxAgeInMs: -50,
    });
  });

  test('testing set fn --> fetch fn', async () => {
    await featherStore.set('qqqq', 'qqqq');
    const firstFetch = await featherStore.fetch('qqqq');
    expect(firstFetch.val).toBe('qqqq');
    const secFetch = await featherStore.fetch('qqqq');
    expect(secFetch).toBeNull();
  });

  test('testing get fn with a non-existing entry', async () => {
    expect(await featherStore.fetch('lo-lo-')).toBeNull();
  });

  test('setFn --> fetch --> fetch', async () => {
    await featherStore.set('99999', 99999);
    const firstFetch = await featherStore.fetch('99999');
    expect(firstFetch.val).toBe(99999);
    const secFetch = await featherStore.fetch('99999');
    expect(secFetch).toBe(null);
  });

  test('setFn --> fetch (hold delete) --> fetch --> fetch', async () => {
    await featherStore.set('yyyy', 99999);
    const firstFetch = await featherStore.fetch('yyyy', { delete: false });
    expect(firstFetch.val).toBe(99999);
    const secFetch = await featherStore.fetch('yyyy');
    expect(secFetch.val).toBe(99999);
    const thFetch = await featherStore.fetch('yyyy');
    expect(thFetch).toBe(null);
  });
});

/**
 * testing objects
 */
describe('testing with objects (GET', () => {
  let f: FeatherCache;
  beforeAll(() => {
    f = new FeatherCache();
  });

  test('set -> get -> del -> get', async () => {
    const d = { a: 1 };
    await f.set('a', d);
    expect(await f.get('a')).toBe(d);
    expect((await f.get('a')).a).toBe(1);
    await f.del('a');
  });
});

describe('testing with objects (FETCH', () => {
  let f: FeatherCache;
  beforeAll(() => {
    f = new FeatherCache({});
  });

  test('set -> get -> del -> get', async () => {
    const d = { a: 1 };
    await f.set('a', d);
    expect(await f.fetch('a')).not.toBe(d);
    expect((await f.fetch('a')).val.a).toBe(1);
    await f.del('a');
  });
});
/**
 * testing verifyOptions
 */
describe('testing verify options fn', () => {
  test('when all are set, should return true', () => {
    const opt: IFeatherCacheDriver = {
      setFn: async (k, v) => {
        return;
      },
      getFn: async k => {
        return;
      },
      delFn: async k => {
        return;
      },
    };

    expect(() => verifyOptions(opt)).not.toThrowError();
  });

  test('when one fn is missing, should throw err', () => {
    const opt: IFeatherCacheDriver = {
      setFn: async (k, v) => {
        return;
      },
      // getFn: async k => {
      //   return;
      // },
      delFn: async k => {
        return;
      },
    };

    expect(() => verifyOptions(opt)).toThrowError();
  });

  test('when one another fn is missing, should throw err', () => {
    const opt: IFeatherCacheDriver = {
      setFn: async (k, v) => {
        return;
      },
      // getFn: async k => {
      //   return;
      // },
      // delFn: async k => {
      //   return;
      // },
    };

    expect(() => verifyOptions(opt)).toThrowError();
  });
});
