import { cloneDeepWith } from 'lodash';
import moment from 'moment';

const converterList = [
  {
    encode: {
      test: (value: any) => moment.isMoment(value),
      filter: (value: any) => `_moment:${value.valueOf()}`,
    },
    decode: {
      test: (value: any) =>
        typeof value === 'string' && value.indexOf('_moment:') === 0,
      filter: (value: any) => {
        const [, timestamp] = value.split(':');
        return moment(parseInt(timestamp, 10));
      },
    },
  },
];

export function encodeFormValues(vals: any) {
  return cloneDeepWith(vals, (value: any) => {
    const matchItem = converterList.find(({ encode: { test } }) => test(value));

    if (matchItem) {
      return matchItem.encode.filter(value);
    }

    return undefined;
  });
}

export function decodeFormValues(vals: any) {
  return cloneDeepWith(vals, (value: any) => {
    const matchItem = converterList.find(({ decode: { test } }) => test(value));

    if (matchItem) {
      return matchItem.decode.filter(value);
    }

    return undefined;
  });
}
