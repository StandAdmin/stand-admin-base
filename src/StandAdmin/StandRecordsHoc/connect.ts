import { ConfigLoadingFld, ConfigLoadingMethod } from '../const';
import { getConfig } from '../config';
import { memoize, omit } from 'lodash';
import { IRecordsHocModelParams, IStandConnectInjectProps } from '../interface';

const filterState = memoize(state => {
  return omit(state, [ConfigLoadingFld]);
});

export const StandConnectHoc = <
  R = any,
  P extends IStandConnectInjectProps<R> = any
>(
  hocParams: Partial<IRecordsHocModelParams>,
) => {
  const { getConnect } = getConfig();

  const { configModel, recordModel } = hocParams;

  const { StoreNs } = recordModel || {};

  const { StoreNs: ConfigStoreNs } = configModel || {};

  return (
    WrappedComponent: React.ComponentType<
      Omit<P, keyof IStandConnectInjectProps<R>>
    >,
  ) =>
    getConnect()(
      (state: any): Omit<IStandConnectInjectProps<R>, 'dispatch'> => {
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
            !!configStoreRefState[ConfigLoadingFld] ||
            (loading &&
              loading.effects &&
              loading.effects[`${ConfigStoreNs}/${ConfigLoadingMethod}`]),
        };
      },
    )(WrappedComponent as any);
};

/** @deprecated use StandConnectHoc instead */
export const StandConfigLoadingHoc = StandConnectHoc;
