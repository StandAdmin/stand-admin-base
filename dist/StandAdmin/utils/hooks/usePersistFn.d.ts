export declare type noop = (...args: any[]) => any;
declare function usePersistFn<T extends noop>(fn: T): T;
export default usePersistFn;
