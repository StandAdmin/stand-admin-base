import { ICommonObj } from '../interface';
export declare function isQueryParamsEqual(
  paramsA: ICommonObj,
  paramsB: ICommonObj,
): boolean;
export declare function toUrlQuery(
  origParams: ICommonObj,
  {
    ns,
  }?: {
    ns?: string | false;
  },
): string;
export declare function fromUrlQuery(
  search: string,
  {
    ns,
  }?: {
    ns?: string | false;
  },
): any;
