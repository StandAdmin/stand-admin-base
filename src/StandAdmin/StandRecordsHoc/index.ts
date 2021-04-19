import { StandContext } from '../const';
import StandListCtrlHoc from './ListCtrlHoc';
import StandRecordsHoc from './RecordsHoc';
import StandRecordInfoHoc from './RecordInfoHoc';
import { IRecordsHocCommonParams } from '../interface';
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
