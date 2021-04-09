import React from 'react';

import { EmptyRecordModel } from '../../standModelHelper';
import {
  IRecordsProps,
  IRecordsHocParams,
  IActionCounterHocProps,
  TRecordsHocComp,
} from '../../interface';

import { set, omit } from 'lodash';

import { useStandContext } from '../hooks/useStandContext';

import StandRecordsHoc from '../RecordsHoc';
import { buildStandRecordModelPkg } from '../../standModelHelper';

export default function(hocParams: IRecordsHocParams) {
  const { recordModel = EmptyRecordModel } = hocParams;

  return (WrappedComponent: React.ComponentType<any>): TRecordsHocComp => {
    const Comp: React.FC<IRecordsProps & IActionCounterHocProps> = props => {
      const {
        searchLoading,
        storeRef: { records },
      } = useStandContext();

      return (
        <WrappedComponent
          {...props}
          {...{
            recordInfoLoading: searchLoading,
            recordInfo: records && records[0],
          }}
        />
      );
    };

    return StandRecordsHoc({
      ...hocParams,
      recordModel: buildStandRecordModelPkg({
        ...recordModel.modelOpts,
        searchRecords: params => {
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
            ).then(resp => {
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
