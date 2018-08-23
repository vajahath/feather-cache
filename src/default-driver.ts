import { IFeatherCacheDriver } from './feather-cache-driver.interface';

export const defaultDriver: IFeatherCacheDriver = {
  maxAgeInMs: 60 * 5 * 1000,
  // tslint:disable-next-line:object-literal-shorthand
  setFn: async function(key: string, val: any) {
    this.store[key] = val;
  },
  // tslint:disable-next-line:object-literal-shorthand
  getFn: async function(key: string) {
    return this.store[key];
  },
  // tslint:disable-next-line:object-literal-shorthand
  delFn: async function(key: string) {
    delete this.store[key];
  },
};
