import { IFeatherCacheDriver } from './feather-cache-driver.interface';
import { defaultDriver } from './default-driver';
import { verifyOptions } from './verify-options';

/**
 * Interface for driver
 */
export { IFeatherCacheDriver };

export class FeatherCache {
  /**
   * Internal store. Data will be stored here if no driver
   * fns are provided.
   */
  public store: any = null;

  private options: IFeatherCacheDriver;

  constructor(options?: IFeatherCacheDriver) {
    // verify options
    verifyOptions(options);

    /**
     * if any driver fns are there, that means it is using an
     * external storage option. So clear the internal store for being garbage collected.
     */
    if (options && options.setFn) {
      this.store = undefined;
    } else {
      this.store = {};
    }
    this.options = Object.assign({}, defaultDriver, options);
  }

  /**
   * Delete the key-val pair
   */
  public async del(key: string) {
    await this.options.delFn.call(this, key);
  }

  /**
   * Function to get data. If the data has expired, deletes the pair and it returns null.
   * @param key key to search
   */
  public async get(key: string) {
    const data = await this.options.getFn.call(this, key);
    if (!data || data.validTill < new Date()) {
      // expired
      await this.options.delFn.call(this, key);
      return null;
    }
    return data.val;
  }

  /**
   * Function to get data. If the data has expired, it returns the expired data
   * with __$EXPIRED flag set and then deletes the key.
   * @param key key to search
   */
  public async fetch(
    key: string,
  ): Promise<{ validTill: Date; key: string; val: any; __$EXPIRED?: boolean }> {
    const data = await this.options.getFn.call(this, key);
    if (!data) {
      return null;
    }
    if (data.validTill < new Date()) {
      // expired
      await this.options.delFn.call(this, key);
      data.__$EXPIRED = true;
    }
    return data;
  }

  /**
   * Function to set data
   * @param key key
   * @param val value
   * @param opt options
   */
  public async set(key: string, val: any, opt: ISetOptions = {}) {
    const validTill = new Date(
      new Date().getTime() + (opt.maxAgeInMs || this.options.maxAgeInMs),
    );

    const dataToStore = { validTill, key, val, $__CREATED_AT: new Date() };
    await this.options.setFn.call(this, key, dataToStore);
  }

  public async show() {
    return this.store;
  }
}

interface ISetOptions {
  maxAgeInMs?: number;
}
