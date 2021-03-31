import { stringify, parse as qsParse } from 'query-string';
import { isEqual } from 'lodash';
import { StateParamPrefix } from '../const';

import { paramToUrl, paramFromUrl } from './urlParams';

import { encodeFormVals, decodeFormVals } from './formEncoder';

import { ICommonObj } from '../interface';

export function isQueryParamsEqual(paramsA: ICommonObj, paramsB: ICommonObj) {
  return isEqual(
    fromUrlQuery(toUrlQuery(paramsA)),
    fromUrlQuery(toUrlQuery(paramsB)),
  );
}

export function toUrlQuery(
  origParams: ICommonObj,
  { ns = false }: { ns?: string | false } = {},
) {
  const result: ICommonObj = {};

  const params = encodeFormVals(origParams);

  if (ns) {
    result[ns] = JSON.stringify(params);
  } else {
    Object.keys(params).forEach(k => {
      const val = params[k];

      if (val === null || val === undefined) {
        return;
      }

      Object.assign(result, paramToUrl(k, val));
    });
  }

  return stringify(result);
}

export function fromUrlQuery(
  search: string,
  { ns = false }: { ns?: string | false } = {},
) {
  const urlParams = qsParse(search);

  const result = {};

  if (ns) {
    if (urlParams[ns]) {
      try {
        Object.assign(result, JSON.parse(urlParams[ns] as string));
      } catch (e) {}
    }
  } else {
    Object.keys(urlParams).forEach(k => {
      if (k.indexOf(StateParamPrefix) === 0) {
        return;
      }

      Object.assign(result, paramFromUrl(k, urlParams[k]));
    });
  }

  return decodeFormVals(result);
}
