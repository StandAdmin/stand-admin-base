import { ElementOf } from '../../utils/type';
import './index.less';
declare const clsNames: [
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
];
declare const styles: {
  [k in ElementOf<typeof clsNames>]: string;
};
export default styles;
