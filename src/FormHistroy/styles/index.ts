import type { ElementOf} from '../../StandAdmin/utils/type';
import { tuple } from '../../StandAdmin/utils/type';

import './index.less';

const clsPrefix = 'stand-admin-formhistroy';

const clsNames = tuple('toolbar', 'vtoolbox', 'vtoolbox-icon');

const styles: { [k in ElementOf<typeof clsNames>]: string } = clsNames.reduce(
  (kvMap, clsName) => {
    // eslint-disable-next-line no-param-reassign
    kvMap[clsName] = `${clsPrefix}-${clsName}`;
    return kvMap;
  },
  {} as any,
);

export default styles;
