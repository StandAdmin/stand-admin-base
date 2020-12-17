export const TypeParamsPrefixList = [
  {
    prefix: '_j_',
    type: 'object',
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
  { prefix: '_n_', type: 'number', fromUrl: parseFloat },
  {
    prefix: '_b_',
    type: 'boolean',
    toUrl: (v: boolean) => (v ? 1 : 0),
    fromUrl: (v: string) => v === '1',
  },
];

const identity = (v: any) => v;

export const paramToUrl = (key: string, val: any) => {
  const valType = typeof val;

  const matchTypeItem = TypeParamsPrefixList.find(
    item => item.type === valType,
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
