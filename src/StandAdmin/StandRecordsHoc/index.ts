import { StandContext } from '../const';
import StandListCtrlHoc from './ListCtrlHoc';
import StandRecordsHoc from './RecordsHoc';
import StandRecordInfoHoc from './RecordInfoHoc';
import {
  IRecordsHocCommonParams,
  IRecordsHocFullParams,
  IListCtrlHocParams,
} from '../interface';
import { StandConfigLoadingHoc, StandConnectHoc } from './connect';

import styles from './styles';

export {
  StandRecordsHoc,
  StandContext,
  StandListCtrlHoc,
  StandRecordInfoHoc,
  styles as standStyles,
  StandConfigLoadingHoc,
  StandConnectHoc,
};

const defaultHocParamsInDefineFn: IRecordsHocCommonParams = {
  receiveContextAsProps: false,
};

export function defineCommonHocParams(params: IRecordsHocCommonParams) {
  return { ...defaultHocParamsInDefineFn, ...params };
}

export function defineFullHocParams<R = any>(params: IRecordsHocFullParams<R>) {
  return { ...defaultHocParamsInDefineFn, ...params };
}

export function defineListCtrlHocParams<R = any>(
  params: IListCtrlHocParams<R>,
) {
  return { ...defaultHocParamsInDefineFn, ...params };
}
