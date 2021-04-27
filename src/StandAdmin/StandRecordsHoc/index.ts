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

export function defineCommonHocParams(params: IRecordsHocCommonParams) {
  return params;
}

export function defineFullHocParams<R = any>(params: IRecordsHocFullParams<R>) {
  return params;
}

export function defineListCtrlHocParams<R = any>(
  params: IListCtrlHocParams<R>,
) {
  return params;
}
