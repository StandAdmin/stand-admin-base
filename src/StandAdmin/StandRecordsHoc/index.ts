import styles from './styles';

import { StandContext } from '../const';

import StandListCtrlHoc from './ListCtrlHoc';
import StandRecordsHoc from './RecordsHoc';

export default StandRecordsHoc;

export {
  StandRecordsHoc,
  StandContext,
  StandListCtrlHoc,
  styles as standStyles,
};

export * from './hooks/useStandSearchForm';
export * from './hooks/useStandUpsertForm';
export * from './hooks/useStandTableList';
