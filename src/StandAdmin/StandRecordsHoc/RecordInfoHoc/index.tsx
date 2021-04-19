import React from 'react';

import { EmptyRecordModel } from '../../standModelHelper';
import {
  IRecordInfoHocInjectProps,
  IRecordsHocFullParams,
  TRecordsHocComponent,
  IResponseOfGetRecord,
  ICommonObj,
} from '../../interface';

import { set, omit } from 'lodash';

import { useStandContext } from '../hooks/useStandContext';

import StandRecordsHoc from '../RecordsHoc';
import {
  buildStandRecordModelPkg,
  getAutoStoreNs,
} from '../../standModelHelper';

export default function<
  R extends ICommonObj = any,
  P extends IRecordInfoHocInjectProps<R> = any
>(hocParams: IRecordsHocFullParams<R>) {
  const { recordModel = EmptyRecordModel } = hocParams;

  return (
    WrappedComponent: React.ComponentType<P>,
  ): TRecordsHocComponent<R, P> => {
    const Comp: React.FC<P> = props => {
      const {
        searchLoading,
        storeRef: { records },
      } = useStandContext<R>();

      return (
        <WrappedComponent
          {...(props as P)}
          {...{
            recordInfoLoading: searchLoading,
            recordInfo: records && records[0],
          }}
        />
      );
    };

    return StandRecordsHoc<R>({
      ...hocParams,
      recordModel: buildStandRecordModelPkg({
        ...recordModel.modelOpts,
        StoreNs: getAutoStoreNs(`Info_${recordModel.StoreNs}`),
        searchRecords: (params: any) => {
          const {
            getRecord,
            searchRecords,
            fldsPathInResp = {},
            searchParamsMap = {},
          } = recordModel.modelOpts || {};

          if (getRecord) {
            return getRecord(
              omit(params, [
                searchParamsMap['pageSize'],
                searchParamsMap['pageNum'],
              ]),
            ).then((resp: IResponseOfGetRecord<R>) => {
              if (!resp.success) {
                return resp;
              }

              const listPath =
                (fldsPathInResp && fldsPathInResp.list) || 'data.list';

              const finalResp = {
                success: true,
              };

              set(
                finalResp,
                (Array.isArray(listPath) ? listPath[0] : listPath).split('.'),
                resp.data ? [resp.data] : [],
              );

              return finalResp;
            });
          } else {
            return searchRecords(params);
          }
        },
      }),
    })(Comp as any);
  };
}
