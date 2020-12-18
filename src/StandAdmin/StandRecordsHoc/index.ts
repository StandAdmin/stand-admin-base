import styles from './styles';

import { StandContext } from '../const';

import StandListCtrlHoc from './ListCtrlHoc';
import StandRecordsHoc from './RecordsHoc';

import { IConfigLoadingHocParams } from '../interface';

export {
  StandRecordsHoc,
  StandContext,
  StandListCtrlHoc,
  styles as standStyles,
};

export * from './hooks/useStandSearchForm';
export * from './hooks/useStandUpsertForm';
export * from './hooks/useStandTableList';

export const StandConfigLoadingHoc = (hocParams: IConfigLoadingHocParams) => {
  const { configModel, connect } = hocParams;

  const { StoreNs: ConfigStoreNs } = configModel || {};

  return (WrappedComponent: React.ComponentType<any>) =>
    connect(({ loading }: any) => ({
      configLoading: loading.effects[`${ConfigStoreNs}/loadConfig`],
    }))(WrappedComponent);
};
