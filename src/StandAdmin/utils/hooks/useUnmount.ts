import { useEffect } from 'react';
import usePersistFn from './usePersistFn';

function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}

const useUnmount = (fn: any) => {
  const fnPersist = usePersistFn(fn);

  useEffect(
    () => () => {
      if (isFunction(fnPersist)) {
        fnPersist();
      }
    },
    [fnPersist],
  );
};

export default useUnmount;
