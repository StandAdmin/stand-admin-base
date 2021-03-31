import { ConfigLoadingFld, ConfigLoadingMethod } from '../const';
import { getConfig } from '../config';

import { IConfigLoadingHocParams, IRecordsHocParams } from '../interface';

export const StandConfigLoadingHoc = (hocParams: IConfigLoadingHocParams) => {
  return StandConnectHoc(hocParams);
};

export const StandConnectHoc = (hocParams: Partial<IRecordsHocParams>) => {
  const { getConnect } = getConfig();

  const { configModel, recordModel } = hocParams;

  const { StoreNs } = recordModel || {};

  const { StoreNs: ConfigStoreNs } = configModel || {};

  return (WrappedComponent: React.ComponentType<any>) =>
    getConnect()((props: any) => {
      const storeRefState = StoreNs
        ? props[StoreNs] || (recordModel && recordModel.default.state) || {}
        : {};

      const configStoreRefState = ConfigStoreNs
        ? props[ConfigStoreNs] ||
          (configModel && configModel.default.state) ||
          {}
        : {};

      const { loading } = props;

      return {
        storeRef: storeRefState,
        configStoreRef: configStoreRefState,
        searchLoading: loading.effects[`${StoreNs}/search`],
        configLoading:
          loading.effects[`${ConfigStoreNs}/${ConfigLoadingMethod}`] ||
          !!configStoreRefState[ConfigLoadingFld],
      };
    })(WrappedComponent);
};
