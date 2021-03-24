import { stringify, parse as qsParse } from 'query-string';

import { StateParamPrefix } from '../const';

import { paramToUrl, paramFromUrl } from './urlParams';

import { ICommonObj } from '../interface';

export function toUrlQuery(
  params: ICommonObj,
  { ns = false }: { ns?: string | false } = {},
) {
  const result: ICommonObj = {};

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

  if (ns) {
    if (urlParams[ns]) {
      try {
        return JSON.parse(urlParams[ns] as string);
      } catch (e) {
        return {};
      }
    }

    return {};
  }

  const result = {};

  Object.keys(urlParams).forEach(k => {
    if (k.indexOf(StateParamPrefix) === 0) {
      return;
    }

    Object.assign(result, paramFromUrl(k, urlParams[k]));
  });

  return result;
}
