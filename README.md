# feather-cache

A Simple Pluggable Key-Value Cache For Multiple Storage Options.

[![npm](https://img.shields.io/npm/v/feather-cache.svg)](https://www.npmjs.com/package/feather-cache)
[![Travis](https://img.shields.io/travis/vajahath/feather-cache.svg)](https://travis-ci.org/vajahath/feather-cache)
[![styled with prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

<!-- [![npm](https://img.shields.io/npm/dt/feather-cache.svg)]()
[![Built with generator-ts-np](https://img.shields.io/badge/scaffolding-ts_np-2699ad.svg)](https://github.com/vajahath/generator-ts-np) -->

![](media/feather.png)

## Install

```bash
npm i --save feather-cache
```

You don't have to install type definitions for typescript. It's built in.

## What

This is a simple caching frame which can be used with available drivers or you can easily write one your own. If no drivers are provided (default) works like an in-memory cache. But that is not what this module intended for. The in-memory cache is provided for the sake of convenience. If that is what all you want, [lru-cache](https://www.npmjs.com/package/lru-cache) is recommended.

Actual use case for this module is to use with a driver (mongodb-driver or [indexed-db-driver](https://www.npmjs.com/package/feather-cache-indexeddb) etc.) which enables persistent caching.

### Example

#### in memory cache

```ts
const { FeatherCache } = require('feather-cache');
// or
import { FeatherCache } from 'feather-cache';

// init
const fStore = new FeatherCache({
  maxAgeInMs: 60 * 1000, // 1 min expiry
});

// ...async fn...
await fStore.set('hiya', 'mm!');

await fStore.get('hiya'); //-> mm!
await fStore.fetch('hiya'); //-> { key: 'hiya', val: 'mm!' }

// ... after expiry time
await fStore.get('hiya'); //-> null
```

#### with a driver

```ts
// ...
const fStore = new FeatherCache(driver);
// ...
```

## APIs

| function                          | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FeatherCache.set(key, val, opt)` | returns `Promise`.<br>**`key`**: string<br>**`val`**: any data to be stored <br>**`opt`**: (optional) `{ maxAgeInMs: 1000 }`, sets expiry time.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `FeatherCache.get(key)`           | returns `Promise` which resolves to the stored data. else, `null`. <br> If data has expired returns `null` and then deletes the entry behind the scenes.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `FeatherCache.fetch(key)`         | returns `Promise` which resolves to stored data. The difference between `get` and `fetch` is that, `fetch` returns the stored data one more time after its expiry and then deletes it.<br>**More info:**<br>`get`: `finds data -> if expired deletes it -> returns null`.<br>`fetch`: `finds data -> if expired returns it -> and then deletes it`.<br> However, you can control this behavior by passing the `delete` option (default `delete: true`). Eg: `fStore.fetch('hiya', { delete: false })`. This sets the expiry flag but don't delete it. Sometimes you may find this helpful. |
| `FeatherCache.del(key)`           | returns `Promise` deletes the entry                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

## Configuration / writing drivers

A driver is nothing but a configuration object which exposes a persistent storage interface.

```ts
const dbDriver = {
  maxAgeInMs: 60 * 1000 * 5, // default expiry 5 mins
  setFn: async function(key, val) {
    // db interface to store data
    await Db.create({ key, val });
  },
  getFn: async function(key) {
    // db interface to get data
    const data = await Db.find({ where: { key } });
    return data;
  },
  delFn: async function(key) {
    // db interface to delete data
    await Db.remove({ where: { key } });
  },
};

// pass in the driver
const featherStore = new FeatherCache(dbDriver);
// ...
```

An example: [feather-cache-indexeddb](https://www.npmjs.com/package/feather-cache-indexeddb).

Those who publish drivers advised to follow the naming convention:

```txt
feather-cache-<storage_option_name>
```

Also, attach the key word `feather-cache`.

---

[![used version of ts-np generator](https://img.shields.io/badge/ts--np-v2.0.1-a5a5a5.svg?style=flat-square)](https://github.com/vajahath/generator-ts-np) [![Greenkeeper badge](https://badges.greenkeeper.io/vajahath/feather-cache.svg)](https://greenkeeper.io/)

## Licence

MIT &copy; [Vajahath Ahmed](https://twitter.com/vajahath7)
