/**
 * This function verifies the options passed in the constructor.
 * Either getFn, setFn, delFn should be set or none should be set.
 */

import { IFeatherCacheDriver } from './feather-cache-driver.interface';

export function verifyOptions(options: IFeatherCacheDriver) {
  // if no options set, looks good, return
  if (!options) {
    return true;
  }

  // if none are set looks good, return
  if (!options.setFn && !options.getFn && !options.delFn) {
    return true;
  }

  // if all are set, looks good, return
  if (options.setFn && options.getFn && options.delFn) {
    return true;
  }

  throw new Error(
    'FEATHER-CACHE-INIT-ERR: either setFn/getFn/delFn should be set or none should be set',
  );
}
