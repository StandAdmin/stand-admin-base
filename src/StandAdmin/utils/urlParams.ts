import moment from 'moment';

const momentFormat = 'YYYYMMDDHHmmss';

function momentToStr(v: moment.Moment) {
  return v.format(momentFormat);
}

function momentFromStr(v: string) {
  return moment(v, momentFormat);
}

export const TypeParamsPrefixList = [
  {
    prefix: '_n_',
    test: (val: any) => typeof val === 'number',
    fromUrl: parseFloat,
  },
  {
    prefix: '_b_',
    test: (val: any) => typeof val === 'boolean',
    toUrl: (v: boolean) => (v ? 1 : 0),
    fromUrl: (v: string) => v === '1',
  },
  {
    prefix: '_m_',
    test: (val: any) => val && moment.isMoment(val),
    toUrl: (v: moment.Moment) => momentToStr(v),
    fromUrl: (v: string) => momentFromStr(v),
  },
  {
    prefix: '_mr_',
    test: (val: any) =>
      Array.isArray(val) &&
      val.length > 0 &&
      !val.some(item => !moment.isMoment(item)),
    toUrl: (v: moment.Moment[]) => v.map(item => momentToStr(item)).join(','),
    fromUrl: (v: string) => v.split(',').map(item => momentFromStr(item)),
  },
  {
    prefix: '_j_',
    test: (val: any) => val && typeof val === 'object',
    toUrl: (obj: any) => {
      if (!obj || Object.keys(obj).length === 0) {
        return undefined;
      }

      return JSON.stringify(obj);
    },
    fromUrl: (v: string) => {
      try {
        return JSON.parse(v as string);
      } catch (e) {
        return undefined;
      }
    },
  },
];

const identity = (v: any) => v;

export const paramToUrl = (key: string, val: any) => {
  const matchTypeItem = TypeParamsPrefixList.find(
    item => item.test(val) === true,
  );

  if (!matchTypeItem) {
    return { [key]: val };
  }

  return {
    [`${matchTypeItem.prefix}${key}`]: (matchTypeItem.toUrl || identity)(val),
  };
};

export const paramFromUrl = (key: string, val: any) => {
  const matchTypeItem = TypeParamsPrefixList.find(
    item => key.indexOf(item.prefix) === 0,
  );

  if (!matchTypeItem) {
    return { [key]: val };
  }

  return {
    [key.substr(matchTypeItem.prefix.length)]: (
      matchTypeItem.fromUrl || identity
    )(val),
  };
};
