import { ElementOf, tuple } from '../../utils/type';

import './index.less';

const clsPrefix = 'stand-admin';

const clsNames = tuple(
  'container',
  'pagination',
  'loading',
  'searchLoading',
  'configLoading',
  'table',
  'record',
  'blinkRecord',
  'removingRecord',
  'activeRecord',
  'actionList',
  'tagList',
  'modalWrapper',
  'block',
  'footer',
  'right',
  'readonly',
);

const styles: { [k in ElementOf<typeof clsNames>]: string } = clsNames.reduce(
  (kvMap, clsName) => {
    // eslint-disable-next-line no-param-reassign
    kvMap[clsName] = `${clsPrefix}-${clsName}`;
    return kvMap;
  },
  {} as any,
);

export default styles;
