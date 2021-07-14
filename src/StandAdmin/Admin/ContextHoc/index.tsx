import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Pagination, message, Modal, Spin } from '@/UI/lib';
import { PaginationProps } from '../../../UI/interface';
import classNames from 'classnames';
import { isEqual, debounce, pick, pickBy, omit, omitBy } from 'lodash';
import {
  toUrlQuery,
  fromUrlQuery,
  isQueryParamsEqual,
} from '../../utils/urlQueryHelper';
import { getConfig } from '../../config';
import { logInfo } from '../../utils/logUtils';
import ActionCounterHoc from '../../ActionCounterHoc';
import BatchCheckHoc from '../../BatchCheckHoc';
import { StandContext, ConfigUpdateMethod } from '../../const';
import {
  EmptyConfigModel,
  EmptyRecordModel,
  getDynamicModelPkg,
} from '../../standModelHelper';
import {
  IContextHocInjectProps,
  IContextHocProps,
  IContextHocFullParams,
  IContextMethods,
  IStandConnectInjectProps,
  //IActionCounterHocProps,
  // TAsyncFnAny,
  IStoreActionParams,
  IServiceParams,
  IResponseOfAction,
  TSearchParamsOrId,
  TRecordFormVisibleTag,
  TContextHocComponent,
  ICommonObj,
  TRecordId,
  IStandContextProps,
  IResponseOfSearchRecords,
  TSearchParams,
  IActionCounterHocInjectProps,
  IBatchCheckHocInjectProps,
  TStandConfigGetConfigItem,
  //IStandConnectHocProps,
} from '../../interface';
import {
  getAutoIdGenerator,
  getDisplayName,
  // whyDidYouUpdate,
} from '../../utils/util';
import { StandConnectHoc } from '../connect';

import styles from '../styles';

const getNewMountId = getAutoIdGenerator();

const isUndefined = (v: any) => v === undefined;

const defaultSearchParamsEqualFn = (a: ICommonObj, b: ICommonObj) => {
  return isEqual(omitBy(a, isUndefined), omitBy(b, isUndefined));
};

const defaultSuccessHandlerFn: IContextHocFullParams['successHandler'] = params => {
  const { successMsg, actionTitle } = params;
  message.success(successMsg || `${actionTitle}成功！`);
};

const pickProps = (props: any, keys: boolean | string[]) => {
  if (!keys) {
    return [];
  }

  if (keys === true) {
    return props;
  }

  return pick(props, keys);
};

export default function<
  R extends ICommonObj = any,
  P extends IContextHocInjectProps<R> = any
>(hocParams: IContextHocFullParams<R>) {
  const {
    makeRecordModelPkgDynamic,
    recordModel: origRecordModel = EmptyRecordModel,
    configModel = EmptyConfigModel,
    ...restHocParams
  } = hocParams;

  const recordModel =
    makeRecordModelPkgDynamic && origRecordModel && origRecordModel.modelOpts
      ? getDynamicModelPkg(origRecordModel, makeRecordModelPkgDynamic)
      : origRecordModel;

  const {
    idFieldName = 'id',
    nameFieldName = 'name',
    StoreNsTitle = '',
    StoreNs,
  } = recordModel || {};

  const defaultHocParams: IContextHocFullParams<R> = {
    updateSearchParamsEvenError: false,
    passSearchWhenParamsEqual: false,
    passSearchUpdateIfStoreStale: false,
    syncParamsToUrl: 'auto',
    urlParamsNs: false,
    searchRecordsOnMount: true,
    searchRecordsOnParamsChange: true,
    searchRecordsOnRefresh: true,
    defaultSearchParams: undefined,
    specSearchParams: undefined,
    sorterSearchParams: undefined,
    filterSearchParams: undefined,
    reservedUrlParamNames: [],
    isSearchParamsEqual: defaultSearchParamsEqualFn,
    successHandler: defaultSuccessHandlerFn,
    resetStoreStateWhenUnmount: false,
    resetStoreStateWhenMount: false,
    placeholderIfConfigLoading: true,
    receiveContextAsProps: true,
    receiveHocParamsAsProps: [
      'defaultSearchParams',
      'specSearchParams',
      'listRowSelectionSupport',
    ],
    listRowSelectionSupport: false,
    formNamePrefix: 'Form',
  };

  const getRecordFld = (record: R, fld: string) => {
    if (record) {
      return record[fld];
    }

    return undefined;
  };

  const getRecordId = (record: R) => getRecordFld(record, idFieldName);

  const getRecordName = (record: R) => getRecordFld(record, nameFieldName);

  type OuterCompProps = Omit<P, keyof IContextHocInjectProps<R>>;

  return (
    WrappedComponent: React.ComponentType<P>,
  ): TContextHocComponent<R, OuterCompProps> => {
    type InnerCompProps = IContextHocProps<R> &
      OuterCompProps &
      IStandConnectInjectProps<R> &
      IActionCounterHocInjectProps &
      IBatchCheckHocInjectProps<R>;

    class Comp extends React.Component<InnerCompProps> {
      public static displayName = `Records_${getDisplayName<P>(
        WrappedComponent,
      )}`;

      static defaultProps = {
        ...defaultHocParams,
        ...restHocParams,
      };

      mountId: number = -1;

      debouncedSearchRecords: (
        specParams?: ICommonObj,
      ) => Promise<IResponseOfSearchRecords<R>>;

      latestSearchParams: ICommonObj;

      autoRegisteredStoreNsMap: { [key: string]: boolean } = {};

      constructor(props: any) {
        super(props);

        this.debouncedSearchRecords = debounce(this.searchRecords, 10);

        this.mountId = getNewMountId();
      }

      async componentDidMount() {
        await this.tryRegisterModels();

        if (this.props.resetStoreStateWhenMount) {
          await this.resetRecordsState(this.mountId);
        }

        const { takeOverMount, searchRecordsOnMount } = this.props;

        if (!takeOverMount) {
          if (searchRecordsOnMount) {
            this.searchRecords();
          }
        }
      }

      componentDidUpdate(prevProps: InnerCompProps) {
        // whyDidYouUpdate(StoreNsTitle, prevProps, this.props);

        const {
          searchRecordsOnParamsChange,
          isSearchParamsEqual,
          passSearchUpdateIfStoreStale,
          // searchLoading,
        } = this.props;

        if (searchRecordsOnParamsChange) {
          const prevSearchParams = this.getFinalSearchParams(prevProps);

          const currentSearchParams = this.getFinalSearchParams(
            this.props as any,
          );

          const searchParamsChanged =
            !isSearchParamsEqual(prevSearchParams, currentSearchParams) &&
            !isSearchParamsEqual(
              currentSearchParams,
              this.latestSearchParams || {},
            );

          if (
            searchParamsChanged &&
            !(passSearchUpdateIfStoreStale && this.isStoreDataStale())
          ) {
            this.debouncedSearchRecords();
          }
        }
      }

      async componentWillUnmount() {
        this.cancleDebouncedSearchRecords();

        await this.tryUnregisterModels();

        if (this.props.resetStoreStateWhenUnmount) {
          await this.resetRecordsState(null);
        }
      }

      cancleDebouncedSearchRecords = () => {
        const { cancel } = this.debouncedSearchRecords as any;
        if (cancel) {
          cancel();
        }
      };

      resetRecordsState = (mountId?: number | null) => {
        const { dispatch } = this.props;

        return dispatch({
          type: `${StoreNs}/resetRecordsState`,
          mountId: mountId !== undefined ? mountId : this.mountId,
        });
      };

      getDvaApp = () => {
        const { getDvaApp } = getConfig();

        const app = getDvaApp();

        if (!app) {
          throw new Error('DvaApp still empty now!!');
        }

        return app;
      };

      isModelNsExists = (namespace: string) => {
        const app = this.getDvaApp();

        // eslint-disable-next-line no-underscore-dangle
        const existModels = app._models;

        if (!existModels) {
          throw new Error('_models not exists on DvaApp');
        }

        return existModels.some((model: any) => model.namespace === namespace);
      };

      getRecordModelPkg = () => recordModel;

      getConfigModelPkg = () => configModel;

      getRelModelPkgs = () => {
        return [this.getRecordModelPkg(), this.getConfigModelPkg()].filter(
          pkg => !!pkg,
        );
      };

      tryRegisterModels = () => {
        const app = this.getDvaApp();

        this.getRelModelPkgs().forEach(modelPkg => {
          if (this.isModelNsExists(modelPkg.StoreNs)) {
            // logInfo(`Model alreay exists: ${modelPkg.StoreNs}`);
            return;
          }

          logInfo(`${StoreNsTitle}: Load model: ${modelPkg.StoreNs}`);

          app.model(modelPkg.default);

          if (modelPkg.isDynamic) {
            this.autoRegisteredStoreNsMap[modelPkg.StoreNs] = true;
          }
        });
      };

      tryUnregisterModels = () => {
        const app = this.getDvaApp();

        this.getRelModelPkgs().forEach(modelPkg => {
          if (this.autoRegisteredStoreNsMap[modelPkg.StoreNs]) {
            logInfo(`${StoreNsTitle}: Unload model: ${modelPkg.StoreNs}`);

            app.unmodel(modelPkg.StoreNs);
            delete this.autoRegisteredStoreNsMap[modelPkg.StoreNs];
          }
        });
      };

      getFinalSearchParams = (
        specProps?: InnerCompProps,
        specParams?: ICommonObj,
      ): ICommonObj => {
        const props = specProps || this.props;

        const params =
          specParams || this.getSearchParams(props as InnerCompProps);

        const finalParams = {
          ...this.getDefaultSearchParams(props),
          ...params,
          ...this.getSpecSearchParams(props),
        };

        const { finalSearchParamsFilter } = props;

        return finalSearchParamsFilter
          ? finalSearchParamsFilter(finalParams)
          : finalParams;
      };

      calcParamsWithProp = (
        propKey: string,
        specProps?: InnerCompProps,
        ...rest: any[]
      ) => {
        const props = specProps || this.props;

        const defParams = (props as any)[propKey];

        return typeof defParams === 'function'
          ? defParams(...rest, props)
          : defParams;
      };

      /*
       默认参数
       */
      getDefaultSearchParams = (...args: any) => {
        return this.calcParamsWithProp('defaultSearchParams', ...args);
      };

      /*
       指定参数
       */
      getSpecSearchParams = (...args: any) => {
        return this.calcParamsWithProp('specSearchParams', ...args);
      };

      getSorterSearchParams = (...args: any) => {
        return this.calcParamsWithProp('sorterSearchParams', ...args);
      };

      getFilterSearchParams = (...args: any) => {
        return this.calcParamsWithProp('filterSearchParams', ...args);
      };

      searchRecords = (specParams?: ICommonObj) => {
        const { dispatch, updateSearchParamsEvenError } = this.props;

        this.latestSearchParams = this.getFinalSearchParams(
          this.props as InnerCompProps,
          specParams,
        );

        return dispatch({
          type: `${StoreNs}/search`,
          params: this.latestSearchParams,
          opts: { updateSearchParamsEvenError, mountId: this.mountId },
        }) as Promise<IResponseOfSearchRecords<R>>;
      };

      getLatestSearchParams = () => {
        return this.latestSearchParams;
      };

      getLocation = (specProps?: InnerCompProps) => {
        const props = specProps || this.props;

        if (props.location) {
          return props.location;
        }

        const { getHistory } = getConfig();

        const history = getHistory();

        return history.location;
      };

      getUrlParams = (specProps?: InnerCompProps) => {
        const props = specProps || this.props;

        return fromUrlQuery(this.getLocation(specProps).search, {
          ns: props.urlParamsNs,
        });
      };

      isSyncParamsToUrlEnabled = (specProps?: InnerCompProps): boolean => {
        const props = specProps || this.props;

        const { syncParamsToUrl } = props;

        if (syncParamsToUrl === 'auto') {
          const { getHistory } = getConfig();

          const history = getHistory();

          return !!(props.location && history.location === props.location);
        }

        return !!syncParamsToUrl;
      };

      getSearchParams = (specProps?: InnerCompProps) => {
        const props = specProps || this.props;

        let params;

        if (this.isSyncParamsToUrlEnabled(props as InnerCompProps)) {
          params = this.getUrlParams(props as InnerCompProps);
        } else {
          const { storeRef } = props;
          params = storeRef.searchParams;
        }

        return params;
      };

      reloadSearch = () => {
        const { storeRef } = this.props;
        return this.searchRecords(storeRef.searchParams);
      };

      goSearch = async (params: ICommonObj = {}) => {
        const {
          reservedUrlParamNames,
          passSearchWhenParamsEqual,
          urlParamsNs,
        } = this.props;

        const urlQueryOpts = { ns: urlParamsNs };

        if (this.isSyncParamsToUrlEnabled()) {
          const reservedParams = {};

          const searchInLocation = this.getLocation().search;

          const oldQueryParams = fromUrlQuery(searchInLocation, urlQueryOpts);

          if (reservedUrlParamNames && reservedUrlParamNames.length > 0) {
            Object.assign(
              reservedParams,
              pick(oldQueryParams, reservedUrlParamNames),
            );
          }

          const newQueryParams = { ...reservedParams, ...params };

          if (isQueryParamsEqual(oldQueryParams, newQueryParams)) {
            if (passSearchWhenParamsEqual) {
              return Promise.resolve('passSearchWhenParamsEqual');
            }

            return this.searchRecords(params);
          }

          const searchQuery = [toUrlQuery(newQueryParams, urlQueryOpts)];

          if (urlParamsNs) {
            // Keep "unrelated" params
            const restSearchQuery = toUrlQuery(
              pickBy(
                fromUrlQuery(searchInLocation),
                (value, key) => key !== urlParamsNs,
              ),
            );

            if (restSearchQuery) {
              searchQuery.push(restSearchQuery);
            }
          }

          const { getHistory } = getConfig();

          const history = getHistory();

          history.push({
            pathname: history.location.pathname,
            search: `?${searchQuery.join('&')}`,
          });

          return this.searchRecords(newQueryParams);
        }

        return this.searchRecords(params);
      };

      showEmptyRecordForm = () => {
        return this.showRecordForm(null);
      };

      hideRecordFormOnly = () => {
        const { dispatch, onRecordFormVisibleTagChange } = this.props;

        return (dispatch({
          type: `${StoreNs}/hideRecordFormOnly`,
        }) as Promise<any>).then(() => {
          if (onRecordFormVisibleTagChange) {
            onRecordFormVisibleTagChange(false);
          }
        });
      };

      getRecord = (paramsOrId: TSearchParamsOrId) => {
        const { dispatch } = this.props;

        return dispatch({
          type: `${StoreNs}/getRecord`,
          params:
            typeof paramsOrId === 'object'
              ? paramsOrId
              : { [idFieldName]: paramsOrId },
          opts: { searchOneAsBackup: true },
        }) as Promise<R>;
      };

      getRecordMapByIdList = async (idList: TRecordId[]) => {
        const { getRecordMapByIdList } = this.props;

        if (getRecordMapByIdList) {
          return getRecordMapByIdList(idList);
        }

        const recordList = await Promise.all(
          idList.map(id => this.getRecord({ [idFieldName]: id })),
        );

        const dataMap: ICommonObj = {};

        recordList.forEach(record => {
          dataMap[getRecordId(record)] = record;
        });

        return dataMap;
      };

      loadAndShowRecordForm = (
        paramsOrId: TSearchParamsOrId,
        recordFormVisibleTag = true,
      ) => {
        const modal = Modal.info({
          content: <Spin />,
          maskClosable: false,
          okButtonProps: { style: { display: 'none' } },
        });

        return this.getRecord(paramsOrId)
          .then(activeRecord => {
            if (activeRecord) {
              return this.showRecordForm(activeRecord, recordFormVisibleTag);
            }

            message.warn('没有找到相关记录！');
            return Promise.reject(activeRecord);
          })
          .finally(() => {
            modal.destroy();
          });
      };

      showRecordForm = (
        activeRecord: R,
        recordFormVisibleTag: TRecordFormVisibleTag = true,
      ) => {
        const { dispatch, onRecordFormVisibleTagChange } = this.props;

        return (dispatch({
          type: `${StoreNs}/showRecordForm`,
          params: {
            activeRecord,
            recordFormVisibleTag,
          },
        }) as Promise<any>).then(() => {
          if (onRecordFormVisibleTagChange) {
            onRecordFormVisibleTagChange(recordFormVisibleTag);
          }
        });
      };

      clearActiveRecord = () => {
        const { dispatch } = this.props;
        return dispatch({
          type: `${StoreNs}/clearActiveRecord`,
        });
      };

      handleActionResponse = (
        resp: IResponseOfAction<R>,
        {
          action,
          actionTitle,
          payload,
          shouldRefresh = true,
          successMsg,
          blinkRecord = true,
          StoreNs: specStoreNs,
        }: IStoreActionParams,
      ) => {
        if (resp && resp.success) {
          const {
            searchRecordsOnRefresh,
            onRefresh,
            successHandler,
          } = this.props;

          if (successMsg !== false && successHandler) {
            successHandler({
              StoreNs: specStoreNs || StoreNs,
              successMsg,
              action,
              actionTitle,
              payload,
              shouldRefresh,
            });
          }

          const isUpdateRecord = ['updateRecord'].indexOf(action) >= 0;

          const isAddRecord = ['addRecord'].indexOf(action) >= 0;

          const isUpsert = isUpdateRecord || isAddRecord;

          if (shouldRefresh) {
            if (searchRecordsOnRefresh) {
              const { storeRef: { searchParams = {} } = {} } = this.props;

              this.searchRecords(
                isAddRecord ? omit(searchParams, ['pageNum']) : searchParams,
              ).then(() => {
                if (blinkRecord && isUpsert) {
                  const matchRecord = resp.data || payload.record;

                  if (matchRecord) {
                    this.blinkRecordById(getRecordId(matchRecord));
                  }
                }
              });
            }

            if (onRefresh) {
              onRefresh();
            }
          }

          if (isUpsert) {
            this.hideRecordFormOnly();
          }
        }
      };

      blinkRecordById = (id: TRecordId) => {
        const { dispatch } = this.props;
        return dispatch({
          type: `${StoreNs}/blinkRecordById`,
          id,
        });
      };

      callStoreAction = (args: IStoreActionParams) => {
        const {
          action,
          actionForCount: origActionForCount,
          payload: origPayload,
          StoreNs: specStoreNs,
          handleActionResponse = this.handleActionResponse,
        } = args;

        const actionForCount = origActionForCount || action;

        this.props.increaseActionCount(actionForCount);

        const { dispatch } = this.props;

        const { callStoreActionPayloadFilter } = this.props;

        let payload: any;

        if (callStoreActionPayloadFilter) {
          payload = callStoreActionPayloadFilter(action, origPayload);
        } else {
          payload = origPayload;
        }

        if (payload && payload.type) {
          throw new Error('type field is not allowed in  payload!');
        }

        return dispatch({
          type: `${specStoreNs || StoreNs}/${action}`,
          ...payload,
        })
          .then((resp: any) => {
            if (handleActionResponse) {
              handleActionResponse(resp, args);
            }

            return resp;
          })
          .finally(() => {
            this.props.decreaseActionCount(actionForCount);
          });
      };

      /** @deprecated use callStoreAction instead */
      callAction = (
        action: string,
        actionTitle: string,
        payload: any,
        shouldRefresh: boolean = true,
      ) => {
        // eslint-disable-next-line no-console
        console.warn('callAction is deprecated, use callStoreAction instead');
        return this.callStoreAction({
          action,
          actionTitle,
          payload,
          shouldRefresh,
        });
      };

      callService = ({
        serviceTitle,
        serviceFunction,
        serviceParams,
        ...rest
      }: IServiceParams) =>
        this.callStoreAction({
          action: 'callService',
          actionTitle: serviceTitle,
          payload: { serviceTitle, serviceFunction, serviceParams },
          ...rest,
        });

      addRecord = (
        record: R,
        callback: (resp: IResponseOfAction<R>) => void,
      ) => {
        return this.callStoreAction({
          action: 'addRecord',
          actionForCount: 'upsertRecord',
          actionTitle: `创建${StoreNsTitle}`,
          payload: { record, callback },
        });
      };

      updateRecord = (
        record: R,
        callback: (resp: IResponseOfAction<R>) => void,
      ) => {
        return this.callStoreAction({
          action: 'updateRecord',
          actionForCount: 'upsertRecord',
          actionTitle: `编辑${StoreNsTitle} [${[
            getRecordId(record),
            getRecordName(record),
          ]
            .filter(item => !!item)
            .join(': ')}] `,
          payload: {
            record,
            callback,
          },
        });
      };

      deleteRecord = (
        params: TSearchParams,
        callback: (resp: IResponseOfAction<R>) => void,
      ) => {
        const recordId = getRecordId(params as any);

        return this.callStoreAction({
          action: 'deleteRecord',
          actionTitle: `删除${StoreNsTitle}${
            recordId ? ` [${recordId}] ` : ''
          }`,
          payload: { params, callback },
        });
      };

      onShowSizeChange = (current: number, pageSize: number) => {
        const { storeRef } = this.props;

        const { pagination } = storeRef;

        return this.handleTableChange({ ...pagination, current: 1, pageSize });
      };

      showTotal = (total: number) => `共 ${total.toLocaleString('en')} 条`;

      handlePageNumChange = (current: number, pageSize: number) => {
        return this.handleTableChange({ current, pageSize });
      };

      handleTableChange = (
        { current, pageSize }: { current: number; pageSize: number },
        filters?: any,
        sorter?: any,
      ) => {
        const {
          searchParams = {},
          pagination: { current: origCurrent, pageSize: origPageSize },
        } = this.props.storeRef;

        const sorterParams = sorter
          ? this.getSorterSearchParams(this.props, sorter)
          : undefined;

        const filterParams = filters
          ? this.getFilterSearchParams(this.props, filters) || filters
          : undefined;

        const newSearchParams = {
          ...searchParams,
          ...sorterParams,
          ...filterParams,
          pageNum: current || origCurrent,
          pageSize: pageSize || origPageSize,
        };

        const withUpdates = !this.props.isSearchParamsEqual(
          newSearchParams,
          searchParams,
        );

        if (withUpdates) {
          this.goSearch({ ...searchParams, ...newSearchParams });
        }
      };

      renderEmpty = () => {
        const { searchLoading } = this.props;

        return (
          <Empty
            style={{ marginTop: 36 }}
            description={
              searchLoading ? (
                <span>
                  <LoadingOutlined style={{ marginRight: 4 }} />
                  加载中
                </span>
              ) : (
                undefined
              )
            }
          />
        );
      };

      renderPagination = ({
        className,
        ...restProps
      }: PaginationProps = {}) => {
        const { storeRef } = this.props;

        const { pagination } = storeRef;

        const { total } = pagination;

        if (total === undefined || total <= 0) {
          return null;
        }

        return (
          <Pagination
            // size="small"
            className={classNames(styles.pagination, className)}
            {...{
              ...pagination,
              onChange: this.handlePageNumChange,
              onShowSizeChange: this.onShowSizeChange,
              showTotal: this.showTotal,
              pageSizeOptions: [10, 20, 30, 50, 100].map(s => String(s)),
              showSizeChanger: true,
              // showQuickJumper: true,
            }}
            {...restProps}
          />
        );
      };

      updateConfig = (
        getConfig: TStandConfigGetConfigItem,
        updateConfigLoading: boolean = false,
      ): Promise<ICommonObj> => {
        const { dispatch } = this.props;

        return dispatch({
          type: `${this.getConfigModelPkg().StoreNs}/${ConfigUpdateMethod}`,
          getConfig,
          updateConfigLoading,
        }) as any;
      };

      getInsMethods = (): IContextMethods<R> => {
        const {
          clearActiveRecord,
          hideRecordFormOnly,
          updateRecord,
          addRecord,
          showRecordForm,
          deleteRecord,
          goSearch,
          getSearchParams,
          reloadSearch,
          searchRecords,
          getRecordMapByIdList,
          getRecord,
          loadAndShowRecordForm,
          getUrlParams,
          showEmptyRecordForm,
          callAction,
          renderPagination,
          renderEmpty,
          handleTableChange,

          getDefaultSearchParams,
          getSpecSearchParams,
          callStoreAction,
          callService,
          getLatestSearchParams,
          debouncedSearchRecords,
          getRecordModelPkg,
          getConfigModelPkg,
          blinkRecordById,
          updateConfig,
        } = this;

        return {
          getRecordName,
          getRecordId,
          clearActiveRecord,
          hideRecordFormOnly,
          hideRecordForm: hideRecordFormOnly,
          updateRecord,
          addRecord,
          showRecordForm,
          deleteRecord,
          goSearch,
          getSearchParams,
          reloadSearch,
          searchRecords,
          getRecordMapByIdList,
          getRecord,
          loadAndShowRecordForm,
          getUrlParams,
          showEmptyRecordForm,
          callAction,
          renderPagination,
          renderEmpty,
          handleTableChange,
          getDefaultSearchParams,
          getSpecSearchParams,
          callStoreAction,
          callService,
          getLatestSearchParams,
          debouncedSearchRecords,
          getRecordModelPkg,
          getConfigModelPkg,
          blinkRecordById,
          updateConfig,
        };
      };

      isStoreDataStale = () => {
        const { storeRef } = this.props;

        return !!(
          storeRef &&
          storeRef.mountId &&
          this.mountId !== storeRef.mountId
        );
      };

      getBatchCheckHocInject = (): IBatchCheckHocInjectProps<R> => {
        const {
          checkedList,
          isAllChecked,
          isRecordChecked,
          isChecked,
          setChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          batchToggleChecked,
          getCheckedList,
        } = this.props;

        return {
          isChecked,
          checkedList,
          isAllChecked,
          isRecordChecked,
          setChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          batchToggleChecked,
          getCheckedList,
        };
      };

      getActionCounterHocInject = (): IActionCounterHocInjectProps => {
        const {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        } = this.props;

        return {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        };
      };

      getStandContext = (): IStandContextProps<R> => {
        const {
          configLoading,
          storeRef,
          configStoreRef,
          searchLoading,
          formNamePrefix,
        } = this.props;

        return {
          StoreNs,
          storeRef,
          configStoreRef,
          config: configStoreRef,
          searchLoading,
          configLoading,
          recordNsTitle: StoreNsTitle,
          StoreNsTitle,
          idFieldName,
          nameFieldName,
          formNamePrefix,

          isStoreDataStale: this.isStoreDataStale(),
          mountId: this.mountId,

          dispatch: this.props.dispatch,

          ...this.getActionCounterHocInject(),
          ...this.getBatchCheckHocInject(),
          ...this.getInsMethods(),
        };
      };

      render() {
        const {
          configLoading,
          placeholderIfConfigLoading,
          wrapperClassName,
          wrapperStyle,
          searchLoading,
          receiveContextAsProps,
          receiveHocParamsAsProps,
          ...restProps
        } = this.props;

        if (configLoading && placeholderIfConfigLoading) {
          return placeholderIfConfigLoading === true ? (
            <Spin />
          ) : (
            placeholderIfConfigLoading
          );
        }

        const contextVal = this.getStandContext();

        const hocParamsKeys = Object.keys(defaultHocParams);

        const finalProps: P = {
          // inject props
          isStandAdminHoc: true,
          getStandContext: this.getStandContext,

          // context props
          ...pickProps(contextVal, receiveContextAsProps),

          // hocparams props
          ...pickProps(pick(restProps, hocParamsKeys), receiveHocParamsAsProps),

          // pass rest props
          ...omit(restProps, [...Object.keys(contextVal), ...hocParamsKeys]),
        };

        return (
          <div
            style={wrapperStyle}
            className={classNames(
              styles.container,
              {
                [styles.searchLoading]: searchLoading,
                [styles.configLoading]: configLoading,
                [styles.loading]:
                  searchLoading ||
                  configLoading ||
                  contextVal.getActionCount() > 0,
              },
              wrapperClassName,
            )}
          >
            <StandContext.Provider value={contextVal}>
              <WrappedComponent {...finalProps} />
            </StandContext.Provider>
          </div>
        );
      }
    }

    return StandConnectHoc<R>({ configModel, recordModel })(
      ActionCounterHoc()(
        BatchCheckHoc<R>({
          recordMatch: (a: R, b: R) => {
            if (a === b) {
              return true;
            }

            const aId = getRecordId(a);
            const bId = getRecordId(b);

            if (aId) {
              return aId === bId;
            }

            return isEqual(a, b);
          },
        })(Comp as any),
      ),
    );
  };
}
