import { identity } from 'lodash';

import type { TCommonObj } from '../interface';

import { toUrlQuery, fromUrlQuery } from './urlQueryHelper';

import { encodeFormValues, decodeFormValues } from './formEncoder';

export default {
  /**
   * map({key:value}) 转 option({value:key,label:value})
   */
  mapToOptions(obj: TCommonObj, opts?: { valueFilter: (val: any) => any }) {
    const { valueFilter = identity } = opts || {};

    return Object.keys(obj).map((key) => ({
      value: valueFilter(key),
      label: obj[key],
    }));
  },
  /**
   * array([item])转option({value:item,label:item})
   */
  arrayToOptions(arr: any[], opts?: { valueFilter: (val: any) => any }) {
    const { valueFilter = identity } = opts || {};

    return arr.map((value) => ({ value: valueFilter(value), label: value }));
  },

  stringifyQueryParams: toUrlQuery,
  parseQueryString: fromUrlQuery,
  encodeFormValues,
  decodeFormValues,
};
