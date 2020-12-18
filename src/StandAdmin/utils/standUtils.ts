import { identity } from 'lodash';

import { ICommonObj } from '../interface';

export default {
  mapToOptions(obj: ICommonObj, opts: { valueFilter: (val: any) => any }) {
    const { valueFilter = identity } = opts || {};

    return Object.keys(obj).map(key => ({
      value: valueFilter(key),
      label: obj[key],
    }));
  },
  arrayToOptions(arr: any[]) {
    return arr.map(value => ({ value, label: value }));
  },
};
