import { identity } from 'lodash';

export default {
  mapToOptions(obj, opts) {
    const { valueFilter = identity } = opts || {};

    return Object.keys(obj).map(key => ({
      value: valueFilter(key),
      label: obj[key],
    }));
  },
  arrayToOptions(arr) {
    return arr.map(value => ({ value, label: value }));
  },
};
