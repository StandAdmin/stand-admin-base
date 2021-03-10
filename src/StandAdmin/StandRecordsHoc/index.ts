import styles from './styles';

import { StandContext, ConfigLoadingFld, ConfigLoadingMethod } from '../const';

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
export * from './hooks/useStandContext';

export const StandConfigLoadingHoc = (hocParams: IConfigLoadingHocParams) => {
  const { configModel, getConnect } = hocParams;

  const { StoreNs: ConfigStoreNs } = configModel || {};

  return (WrappedComponent: React.ComponentType<any>) =>
    getConnect()(({ loading, [ConfigStoreNs]: configStoreRef }: any) => {
      const configStoreRefState =
        configStoreRef || configModel.default.state || {};

      return {
        configLoading:
          loading.effects[`${ConfigStoreNs}/${ConfigLoadingMethod}`] ||
          configStoreRefState[ConfigLoadingFld],
      };
    })(WrappedComponent);
};
