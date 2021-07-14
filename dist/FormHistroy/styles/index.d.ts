import { ElementOf } from '../../StandAdmin/utils/type';
import './index.less';
declare const clsNames: ['toolbar', 'vtoolbox', 'vtoolbox-icon'];
declare const styles: {
  [k in ElementOf<typeof clsNames>]: string;
};
export default styles;
