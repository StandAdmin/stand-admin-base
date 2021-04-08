import { StandContext } from '../const';
import StandListCtrlHoc from './ListCtrlHoc';
import StandRecordsHoc from './RecordsHoc';
import { IRecordCommonHocParams } from '../interface';
import { StandConfigLoadingHoc, StandConnectHoc } from './connect';

import styles from './styles';

export {
  StandRecordsHoc,
  StandContext,
  StandListCtrlHoc,
  styles as standStyles,
  StandConfigLoadingHoc,
  StandConnectHoc,
};

export function defineCommonHocParams(params: IRecordCommonHocParams) {
  return params;
}
