import React from 'react';
import { notification, Modal } from 'antd';
import { merge, get } from 'lodash';
// import Localforage from 'localforage';
import { ConfigLoadingFld, ConfigLoadingMethod } from './const';

import {
  IResponse,
  TAsyncFnAny,
  ICommonObj,
  IStandModelOptions,
  IStandConfigModelOptions,
  IModelPkg,
} from './interface';

function delayP(ms: number, val = true) {
  return new Promise(resolve => {
    setTimeout(resolve, ms, val);
  });
}

// const localforage = Localforage.createInstance({
//   name: 'StandModel',
// });

const isFunction = (f: any) => typeof f === 'function';

function convertParamsName(
  params: ICommonObj,
  nameMap: { [key: string]: string },
) {
  if (!params) {
    return params;
  }

  const newParams: ICommonObj = {};

  Object.keys(params).forEach(key => {
    newParams[nameMap[key] || key] = params[key];
  });

  return newParams;
}

function getFirstNotEmptyVal(obj: ICommonObj, pathList: string[] | string) {
  if (!pathList) {
    throw new Error('pathList is Empty!');
  }

  const list = Array.isArray(pathList) ? pathList : [pathList];

  for (let i = 0, len = list.length; i < len; i += 1) {
    const val = get(obj, list[i]);
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
    errorMsgFields?: string[];
    permissionApplyUrlFields?: string[];
  } = {},
) {
  if (!response || response.success) {
    return;
  }

  const errorContent = getFirstNotEmptyVal(response, errorMsgFields);

  const permissionApplyUrl = getFirstNotEmptyVal(
    response,
    permissionApplyUrlFields,
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

export function getDynamicModelPkg(modelPkg: IModelPkg, nsPre: string) {
  const { modelOpts, StoreNs } = modelPkg;

  if (!modelOpts) {
    throw new Error('modelOpts is missing');
  }

  const newStoreNs = `${nsPre}-${StoreNs}`;

  return {
    ...modelPkg,
    StoreNs: newStoreNs,
    default: getStandModel({ ...modelPkg.modelOpts, StoreNs: newStoreNs }),
    isDynamic: true,
  };
}

export function getStandModel(opts: IStandModelOptions) {
  const {
    idFieldName = 'id',
    nameFieldName = 'name',
    fldsPathInResp = {
      pageNum: 'data.pageNum',
      pageSize: 'data.pageSize',
      total: 'data.total',
      list: 'data.list',
      errorMsg: defaultErrorMsgFields,
      permissionApplyUrl: defaultPermissionApplyUrlFields,
    },
    searchParamsMap = {
      pageNum: 'pageNum',
      pageSize: 'pageSize',
    },
    StoreNs,
    StoreNsTitle,
    searchRecords,
    getRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    extensions,
  } = opts;

  if (!StoreNs) {
    throw new Error(`StoreNs should no be empty!`);
  }

  // const LSKey_SearchParams = `${StoreNs}_searchParams`;

  const filterParams = (params: object) =>
    convertParamsName(params, searchParamsMap);

  const getCommonFlds = (resp: IResponse): any => {
    const result: ICommonObj = {};

    Object.keys(fldsPathInResp).forEach(key => {
      result[key] = getFirstNotEmptyVal(resp, fldsPathInResp[key]);
    });

    return result;
  };

  const handleRespError = ({
    response,
    errorTitle,
  }: {
    response: IResponse;
    errorTitle: string;
  }) => {
    handleCommonRespError(StoreNsTitle, response, { errorTitle });
  };

  return merge(
    {
      namespace: StoreNs,
      state: {
        mountId: null,
        idFieldName,
        nameFieldName,
        blinkRecord: null,
        activeRecord: null,
        removingRecord: null,
        records: [],
        searchParams: {},
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
          const response: any = yield call(
            searchRecords,
            filterParams({ pageNum: 1, pageSize: 10, ...params }),
          );

          if (!response || !response.success) {
            handleRespError({ response, errorTitle: '查询单一结果失败' });
            return false;
          }

          const { list, total } = getCommonFlds(response);

          return total > 0 ? list[0] : null;
        },
        *getRecord({ params }: { params?: any }, { call }: any) {
          const response: any = yield call(
            getRecord,
            filterParams({ ...params }),
          );

          if (!response || !response.success) {
            handleRespError({ response, errorTitle: '获取单一结果失败' });
            return false;
          }

          return response.data;
        },
        *search(
          {
            params,
            opts: options = {},
          }: { params?: any; opts: { updateSearchParamsEvenError?: boolean } },
          { call, put }: any,
        ) {
          // yield put({
          //   type: 'saveSearchParams',
          //   params,
          // });

          const { updateSearchParamsEvenError } = options;

          const response: IResponse = yield call(
            searchRecords,
            filterParams({ pageNum: 1, pageSize: 10, ...params }),
          );

          if (!response || !response.success) {
            if (updateSearchParamsEvenError) {
              yield put({
                type: 'saveState',
                payload: {
                  searchParams: params,
                },
              });
            }

            handleRespError({ response, errorTitle: '获取结果列表失败' });
          } else {
            const { list, pageSize, total, pageNum } = getCommonFlds(response);

            yield put({
              type: 'saveState',
              payload: {
                searchParams: params,
                records: list,
                pagination: { current: pageNum, pageSize, total },
              },
            });
          }

          return response;
        },
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
            (state: any) => state[StoreNs].records,
          );
          return records.find((item: any) => item[idFieldName] === id);
        },
        *blinkRecordById(
          { id, timeout = 2000 }: { id: any; timeout: number },
          { put }: any,
        ) {
          const recordItem: any = yield put.resolve({
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
          { put, call }: any,
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
          { call }: any,
        ) {
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
          { call }: any,
        ) {
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
          { call, put }: any,
        ) {
          const { [idFieldName]: id } = params;

          const recordItem: any = id
            ? yield put.resolve({
                type: 'findRecordById',
                id,
              })
            : null;

          yield put({
            type: 'setRemovingRecord',
            record: recordItem || null,
          });

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
          { call }: any,
        ) {
          const response: IResponse = yield call(
            serviceFunction,
            ...serviceParams,
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

          [record, ...recordList].forEach(repItem => {
            const idx = records.findIndex(
              (item: any) => item[idFieldName] === repItem[idFieldName],
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
    },
    isFunction(extensions)
      ? extensions({ ...opts, handleRespError })
      : extensions,
  );
}

export function getStandConfigModel(opts: IStandConfigModelOptions) {
  const { getConfig, StoreNs } = opts;

  if (!StoreNs) {
    throw new Error(`StoreNs should no be empty!`);
  }

  return {
    namespace: StoreNs,
    state: { [ConfigLoadingFld]: true },
    effects: {
      *[ConfigLoadingMethod](_: any, { all, call, put }: any) {
        put({
          type: 'saveState',
          payload: { [ConfigLoadingFld]: true },
        });

        const results: ICommonObj[] = yield all(
          (Array.isArray(getConfig) ? getConfig : [getConfig]).map(item =>
            isFunction(item) ? call(item) : Promise.resolve(item),
          ),
        );

        yield put({
          type: 'saveState',
          payload: results.reduce(
            (map, item) => {
              Object.assign(map, item);
              return map;
            },
            { [ConfigLoadingFld]: false },
          ),
        });
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
          type: ConfigLoadingMethod,
        });
      },
    },
  };
}

export function buildStandRecordModelPkg(opts: IStandModelOptions): IModelPkg {
  const { idFieldName, nameFieldName, StoreNs, StoreNsTitle } = opts;

  return {
    StoreNs,
    StoreNsTitle,

    idFieldName,
    nameFieldName,

    modelOpts: opts,
    default: getStandModel({ ...opts, StoreNs }),
  };
}

export function buildStandConfigModelPkg(
  opts: IStandConfigModelOptions,
): IModelPkg {
  const { StoreNs, StoreNsTitle } = opts;

  return {
    StoreNs,
    StoreNsTitle,
    default: getStandConfigModel({ ...opts, StoreNs }),
  };
}
