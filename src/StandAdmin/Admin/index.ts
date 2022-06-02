import { StandContext } from '../const';
import StandSelectCtrlHoc from './SelectCtrlHoc';
import StandContextHoc from './ContextHoc';
import StandRecordInfoHoc from './RecordInfoHoc';
import type {
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

const defaultHocParamsInDefineFn: IContextHocCommonParams = {
  receiveContextAsProps: false,
};

export function defineContextHocParams(
  params: IContextHocCommonParams,
): IContextHocCommonParams {
  return { ...defaultHocParamsInDefineFn, ...params };
}

export function defineFullContextHocParams<R = any>(
  params: IContextHocFullParams<R>,
): IContextHocFullParams<R> {
  return { ...defaultHocParamsInDefineFn, ...params };
}

export function defineSelectCtrlHocParams<R = any>(
  params: ISelectCtrlHocParams<R>,
): ISelectCtrlHocParams<R> {
  return { ...defaultHocParamsInDefineFn, ...params };
}

/** @deprecated use StandContextHoc instead */
export const StandRecordsHoc = StandContextHoc;

/** @deprecated use StandSelectCtrlHoc instead */
export const StandListCtrlHoc = StandSelectCtrlHoc;

/** @deprecated use defineSelectCtrlHocParams instead */
export const defineListCtrlHocParams = defineSelectCtrlHocParams;

/** @deprecated use defineFullContextHocParams instead */
export const defineFullHocParams = defineFullContextHocParams;

/** @deprecated use defineContextHocParams instead */
export const defineCommonHocParams = defineContextHocParams;
