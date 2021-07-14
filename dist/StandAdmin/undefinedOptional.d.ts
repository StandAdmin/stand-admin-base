/**
 * Get the keys of the properties to which U can be assigned.
 */
declare type AssignableKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? K : never;
}[keyof T];
/**
 * Get the interface containing only properties to which undefined can be assigned.
 */
declare type UndefinableProperties<T> = {
  [K in AssignableKeys<T, undefined>]: T[K];
};
/**
 * Get all of the keys except those to which U can be assigned.
 */
declare type IncompatibleKeys<T, U> = {
  [K in keyof T]: U extends T[K] ? never : K;
}[keyof T];
/**
 * Get the interface containing no properties to which undefined can be assigned.
 */
declare type OmitUndefinableProperties<T> = {
  [K in IncompatibleKeys<T, undefined>]: T[K];
};
/**
 * Get the interface where all properties are optional.
 */
declare type Optional<T> = {
  [K in keyof T]?: T[K];
};
/**
 * Get the interface where properties that can be assigned undefined are
 * also optional.
 */
export declare type UndefinedOptional<T> = OmitUndefinableProperties<T> &
  Optional<UndefinableProperties<T>>;
export {};
