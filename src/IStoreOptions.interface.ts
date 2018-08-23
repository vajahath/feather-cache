export interface IStoreOptions {
  maxAgeInMs?: number;
  setFn?: (key: string, val: any) => Promise<void>;
  getFn?: (key: string) => Promise<any>;
  delFn?: (key: string) => Promise<void>;
}
