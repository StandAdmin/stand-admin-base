import { identity } from 'lodash';

import { ICommonObj } from '../interface';

export default {
  /**
   * map({key:value}) 转 option({value:key,label:value})
   */
  mapToOptions(obj: ICommonObj, opts: { valueFilter: (val: any) => any }) {
    const { valueFilter = identity } = opts || {};

    return Object.keys(obj).map(key => ({
      value: valueFilter(key),
      label: obj[key],
    }));
  },
  /**
   * array([item])转option({value:item,label:item})
   */
  arrayToOptions(arr: any[]) {
    return arr.map(value => ({ value, label: value }));
  },
};
