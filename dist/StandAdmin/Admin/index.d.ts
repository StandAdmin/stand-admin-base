import { StandContext } from '../const';
import StandSelectCtrlHoc from './SelectCtrlHoc';
import StandContextHoc from './ContextHoc';
import StandRecordInfoHoc from './RecordInfoHoc';
import {
  IContextHocCommonParams,
  IContextHocFullParams,
  ISelectCtrlHocParams,
} from '../interface';
import { StandConfigLoadingHoc, StandConnectHoc } from './connect';
import styles from './styles';
export {
  StandContextHoc,
  StandContext,
  StandSelectCtrlHoc,
  StandRecordInfoHoc,
  styles as standStyles,
  StandConfigLoadingHoc,
  StandConnectHoc,
};
export declare function defineContextHocParams(
  params: IContextHocCommonParams,
): IContextHocCommonParams;
export declare function defineFullContextHocParams<R = any>(
  params: IContextHocFullParams<R>,
): IContextHocFullParams<R>;
export declare function defineSelectCtrlHocParams<R = any>(
  params: ISelectCtrlHocParams<R>,
): ISelectCtrlHocParams<R>;
/** @deprecated use StandContextHoc instead */
export declare const StandRecordsHoc: typeof StandContextHoc;
/** @deprecated use StandSelectCtrlHoc instead */
export declare const StandListCtrlHoc: typeof StandSelectCtrlHoc;
/** @deprecated use defineSelectCtrlHocParams instead */
export declare const defineListCtrlHocParams: typeof defineSelectCtrlHocParams;
/** @deprecated use defineFullContextHocParams instead */
export declare const defineFullHocParams: typeof defineFullContextHocParams;
/** @deprecated use defineContextHocParams instead */
export declare const defineCommonHocParams: typeof defineContextHocParams;
