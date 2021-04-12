import { ConfigLoadingFld, ConfigLoadingMethod } from '../const';
import { getConfig } from '../config';
import { memoize, omit } from 'lodash';
import { IRecordsHocParams } from '../interface';

const filterState = memoize(state => {
  return omit(state, [ConfigLoadingFld]);
});

export const StandConnectHoc = (hocParams: Partial<IRecordsHocParams>) => {
  const { getConnect } = getConfig();

  const { configModel, recordModel } = hocParams;

  const { StoreNs } = recordModel || {};

  const { StoreNs: ConfigStoreNs } = configModel || {};

  return (WrappedComponent: React.ComponentType<any>) =>
    getConnect()((state: any) => {
      const storeRefState = StoreNs
        ? state[StoreNs] || (recordModel && recordModel.default.state) || {}
        : {};

      const configStoreRefState = ConfigStoreNs
        ? state[ConfigStoreNs] ||
          (configModel && configModel.default.state) ||
          {}
        : {};

      const { loading } = state;

      return {
        storeRef: storeRefState,
        configStoreRef: filterState(configStoreRefState),
        searchLoading: storeRefState.searchLoading, // loading.effects[`${StoreNs}/search`],
        configLoading:
          loading.effects[`${ConfigStoreNs}/${ConfigLoadingMethod}`] ||
          !!configStoreRefState[ConfigLoadingFld],
      };
    })(WrappedComponent);
};

/** @deprecated use StandConnectHoc instead */
export const StandConfigLoadingHoc = StandConnectHoc;
