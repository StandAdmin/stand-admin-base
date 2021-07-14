import { ICommonObj } from '../interface';
import { toUrlQuery, fromUrlQuery } from './urlQueryHelper';
import { encodeFormValues, decodeFormValues } from './formEncoder';
declare const _default: {
  /**
   * map({key:value}) 转 option({value:key,label:value})
   */
  mapToOptions(
    obj: ICommonObj,
    opts?: {
      valueFilter: (val: any) => any;
    },
  ): {
    value: any;
    label: any;
  }[];
  /**
   * array([item])转option({value:item,label:item})
   */
  arrayToOptions(
    arr: any[],
    opts?: {
      valueFilter: (val: any) => any;
    },
  ): {
    value: any;
    label: any;
  }[];
  stringifyQueryParams: typeof toUrlQuery;
  parseQueryString: typeof fromUrlQuery;
  encodeFormValues: typeof encodeFormValues;
  decodeFormValues: typeof decodeFormValues;
};
export default _default;
