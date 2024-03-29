import React from 'react';
import { notification, Modal } from '../UI/lib';
import { merge, get } from 'lodash';
// import Localforage from 'localforage';
import {
  ConfigLoadingFld,
  ConfigUpdateMethod,
  ModelNsPre,
  ConfigLoadMethod,
} from './const';

import { getAutoIdGenerator, markAndMatch } from './utils/util';

import type {
  IResponse,
  TAsyncFnAny,
  TCommonObj,
  IStandModelOptions,
  IStandConfigModelOptions,
  IModelPkg,
  IResponseOfSearchRecords,
  IResponseOfGetRecord,
  TFldsPathInRespMapValue,
  TFldsPathInRespMapKeys,
  TStandConfigGetConfigItem,
  DvaModel,
} from './interface';
import { logWarn } from './utils/logUtils';

const getAutoId = getAutoIdGenerator();

function delayP(ms: number, val = true) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms, val);
  });
}

const emptySearchRecords = async () => ({
  success: true,
  data: {},
});
// const localforage = Localforage.createInstance({
//   name: 'StandModel',
// });

const isFunction = (f: any) => typeof f === 'function';

function convertParamsName(
  params: TCommonObj,
  nameMap: Record<string, string>
) {
  if (!params) {
    return params;
  }

  const newParams: TCommonObj = {};

  Object.keys(params).forEach((key) => {
    newParams[nameMap[key] || key] = params[key];
  });

  return newParams;
}

function getFirstNotEmptyVal(
  obj: TCommonObj,
  key: TFldsPathInRespMapKeys,
  pathList: TFldsPathInRespMapValue
) {
  if (!pathList) {
    throw new Error('pathList is Empty!');
  }

  const list = Array.isArray(pathList) ? pathList : [pathList];

  for (let i = 0, len = list.length; i < len; i += 1) {
    const fldPath = list[i];

    const val =
      typeof fldPath === 'string' ? get(obj, fldPath) : fldPath(obj, key);
    if (val) {
      return val;
    }
  }

  return undefined;
}

const defaultErrorMsgFields = ['message', 'msg', 'resultMsg'];

const defaultPermissionApplyUrlFields = ['permissionApplyUrl'];

export function handleCommonRespError(
  requestTitle: string,
  response: IResponse | null,
  {
    errorTitle = '接口请求失败',
    errorMsgFields = defaultErrorMsgFields,
    permissionApplyUrlFields = defaultPermissionApplyUrlFields,
  }: {
    errorTitle?: string;
    errorMsgFields?: TFldsPathInRespMapValue;
    permissionApplyUrlFields?: TFldsPathInRespMapValue;
  } = {}
) {
  if (!response || response.success) {
    return;
  }

  const errorContent = getFirstNotEmptyVal(
    response,
    'errorMsg',
    errorMsgFields
  );

  const permissionApplyUrl = getFirstNotEmptyVal(
    response,
    'permissionApplyUrl',
    permissionApplyUrlFields
  );

  if (permissionApplyUrl) {
    Modal.warning({
      title: errorContent,
      content: (
        <a href={permissionApplyUrl} target="_blank" rel="noopener noreferrer">
          申请权限
        </a>
      ),
    });
    return;
  }

  notification.error({
    message: `${requestTitle}: ${errorTitle}`,
    description: errorContent || JSON.stringify(response),
  });
}

export function getStandModel<R = any>(opts: IStandModelOptions<R>): DvaModel {
  const {
    idFieldName = 'id',
    nameFieldName = 'name',
    fldsPathInResp: origFldsPathInResp,
    searchParamsMap: origSearchParamsMap,
    StoreNs = getAutoStoreNs('Record'),
    StoreNsTitle = '记录',
    searchRecords = emptySearchRecords,
    getRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    extensions,
  } = opts;

  if (!StoreNs) {
    throw new Error(`StoreNs should no be empty!`);
  }

  const fldsPathInResp = {
    pageNum: 'data.pageNum',
    pageSize: 'data.pageSize',
    total: 'data.total',
    list: 'data.list',
    extraPayload: 'data.extraPayload',
    errorMsg: defaultErrorMsgFields,
    permissionApplyUrl: defaultPermissionApplyUrlFields,
    ...(origFldsPathInResp || undefined),
  };

  const searchParamsMap = {
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    ...(origSearchParamsMap || undefined),
  };

  // const LSKey_SearchParams = `${StoreNs}_searchParams`;

  const filterParams = (params: object) =>
    convertParamsName(params, searchParamsMap);

  const getCommonFlds = (resp: IResponse): any => {
    const result: TCommonObj = {};

    (Object.keys(fldsPathInResp) as TFldsPathInRespMapKeys[]).forEach(
      (key: TFldsPathInRespMapKeys) => {
        const val = getFirstNotEmptyVal(resp, key, fldsPathInResp[key]);

        if (val !== undefined) {
          result[key] = val;
        }
      }
    );

    return result;
  };

  const handleRespError = ({
    response,
    errorTitle,
  }: {
    response: IResponse;
    errorTitle: string;
  }) => {
    handleCommonRespError(StoreNsTitle, response, {
      errorTitle,
      errorMsgFields: fldsPathInResp.errorMsg,
      permissionApplyUrlFields: fldsPathInResp.permissionApplyUrl,
    });
  };

  const markTag = markAndMatch();

  const interModel: DvaModel = {
    namespace: StoreNs,
    state: {
      mountId: null,
      idFieldName,
      nameFieldName,
      blinkRecord: null,
      activeRecord: null,
      removingRecord: null,
      records: [],
      extraPayload: null,
      searchParams: {},
      searchLoading: false,
      pagination: { total: 0, current: 1, pageSize: 10 },
      recordFormVisibleTag: false,
    },
    effects: {
      // *searchWithLastParams(_, { put }) {
      //   const params = yield put.resolve({
      //     type: 'getSearchParamsInLocalStore',
      //   });

      //   return yield put.resolve({
      //     type: 'search',
      //     params,
      //   });
      // },
      // *getSearchParamsInLocalStore(_, { cps }) {
      //   const params = yield cps([localforage, localforage.getItem], LSKey_SearchParams);
      //   return params;
      // },
      *searchOne({ params }: { params?: any }, { call }: any) {
        if (!searchRecords) {
          throw new Error(`searchRecords is empty!`);
        }

        const response: IResponseOfSearchRecords<R> = yield call(
          searchRecords,
          filterParams({ pageNum: 1, pageSize: 10, ...params })
        );

        if (!response || !response.success) {
          handleRespError({ response, errorTitle: '查询单一结果失败' });
          return false;
        }

        const { list = [] } = getCommonFlds(response);

        return list && list.length > 0 ? list[0] : null;
      },
      *getRecord(
        {
          params,
          opts: options = {},
        }: {
          params?: any;
          opts: { searchOneAsBackup?: boolean };
        },
        { call, put }: any
      ) {
        if (!getRecord) {
          const { searchOneAsBackup } = options;

          if (searchOneAsBackup) {
            const result: R = yield put.resolve({
              type: 'searchOne',
              params,
            });

            return result;
          }

          throw new Error(`getRecord is empty!`);
        }

        const response = (yield call(
          getRecord,
          filterParams({ ...params })
        )) as IResponseOfGetRecord<R>;

        if (!response || !response.success) {
          handleRespError({ response, errorTitle: '获取单一结果失败' });
          return false;
        }

        return response.data;
      },

      search: [
        function* (
          {
            params,
            opts: options = {},
          }: {
            params?: any;
            opts: { updateSearchParamsEvenError?: boolean; mountId?: number };
          },
          { call, put }: any
        ) {
          const { updateSearchParamsEvenError, mountId } = options;

          const reqParams = { pageNum: 1, pageSize: 10, ...params };

          yield put({
            type: 'saveState',
            payload: {
              searchLoading: true,
              ...(mountId ? { mountId } : undefined),
            },
          });

          if (!searchRecords) {
            throw new Error(`searchRecords is empty!`);
          }

          const [tagMatch] = markTag('search');

          const response: IResponseOfSearchRecords<R> = yield call(
            searchRecords,
            filterParams(reqParams)
          );

          if (!tagMatch()) {
            logWarn('Seemed another search request has been sent!!!');
          }

          const newPayload = {};

          if (!response || !response.success) {
            if (updateSearchParamsEvenError) {
              Object.assign(newPayload, {
                searchParams: params,
              });
            }

            handleRespError({ response, errorTitle: '获取结果列表失败' });
          } else {
            const {
              list = [],
              total: origTotal,
              extraPayload,
              pageSize = reqParams.pageSize,
              pageNum = reqParams.pageNum || 1,
            } = getCommonFlds(response);

            const total = origTotal !== undefined ? origTotal : list.length;

            Object.assign(newPayload, {
              searchParams: params,
              records: list,
              extraPayload,
              pagination: { current: pageNum, pageSize, total },
            });
          }

          yield put({
            type: 'saveState',
            payload: { ...newPayload, searchLoading: false },
          });

          return response;
        },
        { type: 'takeLatest' },
      ],

      *showRecordForm({ params }: { params: any }, { put }: any) {
        // const { activeRecord } = params || {};

        yield put({
          type: 'saveState',
          payload: { recordFormVisibleTag: true, ...params },
        });

        return true;
      },
      *hideRecordForm(_: any, { put }: any) {
        // const { recordFormVisibleTag } = params;
        yield put({
          type: 'saveState',
          payload: { activeRecord: null, recordFormVisibleTag: false },
        });

        return true;
      },
      *clearActiveRecord(_: any, { put }: any) {
        // const { recordFormVisibleTag } = params;
        yield put({
          type: 'saveState',
          payload: { activeRecord: null },
        });

        return true;
      },
      *setRemovingRecord({ record }: { record: any }, { put }: any) {
        // const { recordFormVisibleTag } = params;
        yield put({
          type: 'saveState',
          payload: { removingRecord: record },
        });

        return true;
      },
      *saveSearchParams({ params }: { params: any }, { put }: any) {
        // localforage.setItem(
        //   LSKey_SearchParams,
        //   omit(
        //     params,
        //     ['pageNum', 'pageSize'].map((item) => searchParamsMap[item] || item)
        //   )
        // );

        yield put({
          type: 'saveState',
          payload: { searchParams: params },
        });

        return true;
      },
      *hideRecordFormOnly(_: any, { put }: any) {
        // const { recordFormVisibleTag } = params;
        yield put({
          type: 'saveState',
          payload: { recordFormVisibleTag: false },
        });

        return true;
      },
      *findRecordById({ id }: { id: any }, { select }: any) {
        const records: any[] = yield select(
          (state: any) => state[StoreNs].records
        );
        return records.find((item: any) => item[idFieldName] === id);
      },
      *blinkRecordById(
        { id, timeout = 1000 }: { id: any; timeout: number },
        { put }: any
      ) {
        const recordItem: R = yield put.resolve({
          type: 'findRecordById',
          id,
        });

        yield put({
          type: 'blinkRecord',
          record: recordItem || null,
          timeout,
        });

        return true;
      },
      *blinkRecord(
        { record, timeout = 2000 }: { record: any; timeout?: number },
        { put, call }: any
      ) {
        // const { recordFormVisibleTag } = params;
        yield put({
          type: 'saveState',
          payload: { blinkRecord: record },
        });

        yield call(delayP, timeout);

        yield put({
          type: 'saveState',
          payload: { blinkRecord: null },
        });

        return true;
      },
      *addRecord(
        {
          record,
          callback,
        }: { record: any; callback?: (resp: IResponse) => void },
        { call }: any
      ) {
        if (!addRecord) {
          throw new Error(`addRecord is empty!`);
        }

        const response: IResponse = yield call(addRecord, record);

        if (!response || !response.success) {
          handleRespError({ response, errorTitle: '新建失败' });
        }

        if (callback) callback(response);

        return response;
      },
      *updateRecord(
        {
          record,
          callback,
        }: { record: any; callback?: (resp: IResponse) => void },
        { call }: any
      ) {
        if (!updateRecord) {
          throw new Error(`updateRecord is empty!`);
        }

        const response: IResponse = yield call(updateRecord, record);

        if (!response || !response.success) {
          handleRespError({ response, errorTitle: '更新失败' });
        }

        if (callback) callback(response);
        return response;
      },
      *deleteRecord(
        {
          params,
          callback,
        }: { params: any; callback?: (resp: IResponse) => void },
        { call, put }: any
      ) {
        const { [idFieldName]: id } = params;

        const recordItem: R = id
          ? yield put.resolve({
              type: 'findRecordById',
              id,
            }) as R
          : null;

        yield put({
          type: 'setRemovingRecord',
          record: recordItem || null,
        });

        if (!deleteRecord) {
          throw new Error(`deleteRecord is empty!`);
        }

        const response: IResponse = yield call(deleteRecord, params);

        yield put({
          type: 'setRemovingRecord',
          record: null,
        });

        if (!response || !response.success) {
          handleRespError({ response, errorTitle: '删除失败' });
        }

        if (callback) callback(response);
        return response;
      },
      *callService(
        {
          serviceTitle,
          serviceFunction,
          serviceParams,
          callback,
        }: {
          serviceTitle: string;
          serviceFunction: TAsyncFnAny;
          serviceParams: any;
          callback?: (resp: IResponse) => void;
        },
        { call }: any
      ) {
        if (!serviceFunction) {
          throw new Error(`${serviceTitle}: serviceFunction is empty!`);
        }

        const response: IResponse = yield call(
          serviceFunction,
          ...serviceParams
        );

        if (!response || !response.success) {
          handleRespError({
            response,
            errorTitle: `${serviceTitle} 操作失败`,
          });
        }

        if (callback) callback(response);
        return response;
      },
    },
    reducers: {
      replaceRecord(state: any, action: any) {
        const { records } = state;

        const {
          params: { record, recordList = [] },
        } = action;

        [record, ...recordList].forEach((repItem) => {
          const idx = records.findIndex(
            (item: any) => item[idFieldName] === repItem[idFieldName]
          );

          if (idx < 0) {
            // eslint-disable-next-line no-console
            console.warn('No match record found: ', repItem);
            return;
          }

          records[idx] = repItem;
        });

        return {
          ...state,
          records: [...records],
        };
      },

      resetRecordsState(state: any, action: { mountId: number | null }) {
        return {
          ...state,
          mountId: action.mountId,
          blinkRecord: null,
          activeRecord: null,
          removingRecord: null,
          records: [],
          extraPayload: null,
          searchParams: {},
          pagination: { total: 0, current: 1, pageSize: 10 },
        };
      },
      saveState(state: any, action: { payload: any }) {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
    // subscriptions: {
    //   setup({ dispatch }) {
    //     console.log(StoreNsTitle);
    //   },
    // },
  } as unknown as DvaModel;

  return merge(
    interModel,
    isFunction(extensions)
      ? extensions({ ...opts, handleRespError })
      : extensions
  );
}

export function getStandConfigModel(opts: IStandConfigModelOptions): DvaModel {
  const { getConfig = [], StoreNs = getAutoStoreNs('Config') } = opts;

  if (!StoreNs) {
    throw new Error(`StoreNs should no be empty!`);
  }

  return {
    namespace: StoreNs,
    state: { [ConfigLoadingFld]: true },
    effects: {
      *[ConfigLoadMethod](_: any, { all, call, put }: any) {
        const configObj: TCommonObj = yield put.resolve({
          type: ConfigUpdateMethod,
          getConfig,
          updateConfigLoading: true,
        });

        return configObj;
      },

      *[ConfigUpdateMethod](
        {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          getConfig,
          updateConfigLoading = true,
        }: {
          getConfig: TStandConfigGetConfigItem;
          updateConfigLoading: boolean;
        },
        { all, call, put }: any
      ) {
        if (updateConfigLoading) {
          yield put({
            type: 'saveState',
            payload: { [ConfigLoadingFld]: true },
          });
        }

        const results: TCommonObj[] = yield all(
          (Array.isArray(getConfig) ? getConfig : [getConfig]).map((item) =>
            isFunction(item) ? call(item) : Promise.resolve(item)
          )
        );

        const configObj: TCommonObj = results.reduce((map, item) => {
          Object.assign(map, item);
          return map;
        }, {});

        const payload = {
          ...configObj,
          ...(updateConfigLoading ? { [ConfigLoadingFld]: false } : undefined),
        };

        yield put({
          type: 'saveState',
          payload,
        });

        return configObj;
      },
    },
    reducers: {
      saveState(state: any, action: { payload: any }) {
        return {
          ...state,
          ...action.payload,
        };
      },
    },
    subscriptions: {
      setup({ dispatch }: any) {
        dispatch({
          type: ConfigLoadMethod,
        });
      },
    },
  } as unknown as DvaModel;
}

export function getAutoStoreNs(key: string) {
  return `_Auto${getAutoId()}_${ModelNsPre}${key}`;
}

export function buildStandRecordModelPkg<R = any>(
  opts: IStandModelOptions<R> = {}
): IModelPkg<R> {
  const {
    idFieldName = 'id',
    nameFieldName = 'name',
    StoreNs = getAutoStoreNs('Record'),
    StoreNsTitle = '记录',
    isDynamic = false,
  } = opts;

  return {
    StoreNs,
    StoreNsTitle,

    idFieldName,
    nameFieldName,

    isDynamic,

    modelOpts: opts,
    default: getStandModel<R>({ ...opts, StoreNs }),
  };
}

export function cloneModelPkg<R>(
  modelPkg: IModelPkg,
  nsTag: string = '_Clone',
  opts?: Omit<IStandModelOptions<R>, 'StoreNs'>
) {
  const { modelOpts, StoreNs } = modelPkg;

  if (!modelOpts) {
    throw new Error('modelOpts is missing');
  }

  const newStoreNs = `${nsTag}_A${`${getAutoId()}`}-${StoreNs}`;

  const newModelOpts: IStandModelOptions<R> = {
    ...modelPkg.modelOpts,
    ...opts,
    StoreNs: newStoreNs,
  };

  return buildStandRecordModelPkg(newModelOpts);
}

export function getDynamicModelPkg(
  modelPkg: IModelPkg,
  nsTag: string = '_Dynamic'
) {
  return cloneModelPkg(modelPkg, nsTag, { isDynamic: true });
}

export function buildStandConfigModelPkg(
  opts: IStandConfigModelOptions
): IModelPkg {
  const { StoreNs = getAutoStoreNs('Config'), StoreNsTitle = '配置' } = opts;

  return {
    StoreNs,
    StoreNsTitle,
    default: getStandConfigModel({ ...opts, StoreNs }),
  };
}

export const EmptyConfigModel = buildStandConfigModelPkg({
  StoreNs: `${ModelNsPre}EmptyConfig`,
  StoreNsTitle: '空配置',
  getConfig: [],
});

export const EmptyRecordModel = buildStandRecordModelPkg({
  StoreNs: `${ModelNsPre}EmptyRecord`,
  StoreNsTitle: '空实体',
  idFieldName: 'id',
  nameFieldName: 'name',
});
