import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Pagination, message, Modal, Spin } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import classNames from 'classnames';
import { isEqual, debounce, pick, pickBy } from 'lodash';
import {
  toUrlQuery,
  fromUrlQuery,
  isQueryParamsEqual,
} from '../../utils/urlQueryHelper';
import { getConfig } from '../../config';
import { logInfo } from '../../utils/logUtils';
import ActionCounterHoc from '../../ActionCounterHoc';
import { StandContext } from '../../const';
import { EmptyConfigModel, EmptyRecordModel } from '../../standModelHelper';
import {
  IRecordsProps,
  IRecordsHocParams,
  IActionCounterHocProps,
  // TAsyncFnAny,
  IStoreActionParams,
  IServiceParams,
  TCommonObjOrEmpty,
  TRecordsHocComp,
  ICommonObj,
  IStandContextProps,
} from '../../interface';

import { getAutoIdGenerator } from '../../utils/util';

import { StandConnectHoc } from '../connect';

import styles from '../styles';

const getNewMountId = getAutoIdGenerator();

export default function(hocParams: IRecordsHocParams) {
  const {
    recordModel = EmptyRecordModel,
    configModel = EmptyConfigModel,
    ...restHocParams
  } = hocParams;

  const {
    idFieldName = 'id',
    nameFieldName = 'name',
    StoreNsTitle = '',
    StoreNs,
  } = recordModel || {};

  const defaultRestHocParams = {
    updateSearchParamsEvenError: false,
    passSearchWhenParamsEqual: false,
    syncParamsToUrl: true,
    urlParamsNs: false,
    searchRecordsOnMount: true,
    searchRecordsOnParamsChange: true,
    searchRecordsOnRefresh: true,
    defaultSearchParams: undefined,
    specSearchParams: undefined,
    sorterSearchParams: undefined,
    reservedUrlParamNames: [],
    placeholderIfConfigLoading: true,
    passContextAsProps: true,
    formNamePrefix: 'Form',
    ...restHocParams,
  };

  return (WrappedComponent: React.ComponentType<any>): TRecordsHocComp => {
    class Comp extends React.Component<IRecordsProps & IActionCounterHocProps> {
      static defaultProps = {
        ...defaultRestHocParams,
      };

      mountId: number = -1;

      debouncedSearchRecords: (specParams?: any) => Promise<any>;

      latestSearchParams: any;

      autoRegisteredStoreNsMap: { [key: string]: boolean } = {};

      constructor(props: any) {
        super(props);

        this.debouncedSearchRecords = debounce(this.searchRecords, 10) as any;

        this.mountId = getNewMountId();
      }

      async componentDidMount() {
        await this.tryRegisterModels();

        this.resetRecordsState();

        const { takeOverMount, searchRecordsOnMount } = this.props;

        if (!takeOverMount) {
          if (searchRecordsOnMount) {
            this.searchRecords();
          }
        }
      }

      componentDidUpdate(prevProps: IRecordsProps) {
        const { searchRecordsOnParamsChange } = this.props;

        if (searchRecordsOnParamsChange) {
          const searchParamsChanged = !isEqual(
            this.getFinalSearchParams(prevProps),
            this.getFinalSearchParams(this.props),
          );

          if (searchParamsChanged) {
            const { searchLoading } = this.props;

            if (!searchLoading) {
              this.debouncedSearchRecords();
            }
          }
        }
      }

      async componentWillUnmount() {
        await this.tryUnregisterModels();
        this.resetRecordsState(null);
      }

      resetRecordsState = (mountId?: number | null) => {
        const { dispatch } = this.props;

        dispatch({
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

          logInfo(`Load model: ${modelPkg.StoreNs}`);

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
            app.unmodel(modelPkg.StoreNs);
            delete this.autoRegisteredStoreNsMap[modelPkg.StoreNs];
          }
        });
      };

      getFinalSearchParams = (specProps?: IRecordsProps, specParams?: any) => {
        const props = specProps || this.props;

        const params = specParams || this.getSearchParams(props);

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
        specProps?: IRecordsProps,
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

      searchRecords = (specParams?: TCommonObjOrEmpty) => {
        const { dispatch, updateSearchParamsEvenError } = this.props;

        this.latestSearchParams = this.getFinalSearchParams(
          this.props,
          specParams,
        );

        return dispatch({
          type: `${StoreNs}/search`,
          params: this.latestSearchParams,
          opts: { updateSearchParamsEvenError },
        }) as Promise<any>;
      };

      getLatestSearchParams = () => {
        return this.latestSearchParams;
      };

      getLocation = (specProps?: IRecordsProps) => {
        const props = specProps || this.props;

        if (props.location) {
          return props.location;
        }

        const { getHistory } = getConfig();

        const history = getHistory();

        return history.location;
      };

      getUrlParams = (specProps?: IRecordsProps) => {
        const props = specProps || this.props;

        return fromUrlQuery(this.getLocation(specProps).search, {
          ns: props.urlParamsNs,
        });
      };

      getSearchParams = (specProps?: IRecordsProps) => {
        const props = specProps || this.props;

        const { syncParamsToUrl } = props;

        let params;

        if (syncParamsToUrl) {
          params = this.getUrlParams(props);
        } else {
          const { storeRef } = props;
          params = storeRef.searchParams;
        }

        return params;
      };

      reloadSearch = () => {
        const { storeRef } = this.props;
        this.searchRecords(storeRef.searchParams);
      };

      goSearch = async (params = {}) => {
        const {
          reservedUrlParamNames,
          syncParamsToUrl,
          passSearchWhenParamsEqual,
          urlParamsNs,
        } = this.props;

        const urlQueryOpts = { ns: urlParamsNs };

        if (syncParamsToUrl) {
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
              return;
            }

            this.searchRecords(params);
            return;
          }

          const searchQuery = [toUrlQuery(newQueryParams, urlQueryOpts)];

          if (urlParamsNs) {
            // Keep "unrelated" params
            const extraSearchQuery = toUrlQuery(
              pickBy(
                fromUrlQuery(searchInLocation),
                (value, key) => key !== urlParamsNs,
              ),
            );

            if (extraSearchQuery) {
              searchQuery.push(extraSearchQuery);
            }
          }

          const { getHistory } = getConfig();

          const history = getHistory();

          history.push({
            pathname: history.location.pathname,
            search: searchQuery.join('&'),
          });

          return;
        }

        this.searchRecords(params);
      };

      showEmptyRecordForm = () => {
        this.showRecordForm(null);
      };

      hideRecordFormOnly = () => {
        const { dispatch, onRecordFormVisibleTagChange } = this.props;
        (dispatch({
          type: `${StoreNs}/hideRecordFormOnly`,
        }) as Promise<any>).then(() => {
          if (onRecordFormVisibleTagChange) {
            onRecordFormVisibleTagChange(false);
          }
        });
      };

      getRecord = (params?: TCommonObjOrEmpty) => {
        const { dispatch } = this.props;

        return dispatch({
          type: `${StoreNs}/getRecord`,
          params,
        }) as Promise<any>;
      };

      getRecordMapByIdList = async (idList: any[]) => {
        const { getRecordMapByIdList } = this.props;

        if (getRecordMapByIdList) {
          return getRecordMapByIdList(idList);
        }

        const recordList = await Promise.all(
          idList.map(id => this.getRecord({ [idFieldName]: id })),
        );

        const dataMap: ICommonObj = {};

        recordList.forEach(record => {
          dataMap[this.getRecordId(record)] = record;
        });

        return dataMap;
      };

      loadAndShowRecordForm = (params: any, recordFormVisibleTag = true) => {
        const modal = Modal.info({
          content: <Spin />,
          maskClosable: false,
          okButtonProps: { style: { display: 'none' } },
        });

        this.getRecord(params)
          .then(activeRecord => {
            if (activeRecord) {
              this.showRecordForm(activeRecord, recordFormVisibleTag);
            }
          })
          .finally(() => {
            modal.destroy();
          });
      };

      showRecordForm = (activeRecord: any, recordFormVisibleTag = true) => {
        const { dispatch, onRecordFormVisibleTagChange } = this.props;
        (dispatch({
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
        dispatch({
          type: `${StoreNs}/clearActiveRecord`,
        });
      };

      handleActionResponse = (
        resp: any,
        {
          action,
          actionTitle,
          payload,
          shouldRefresh = true,
          successMsg,
          blinkRecord = true,
        }: IStoreActionParams,
      ) => {
        if (resp && resp.success) {
          const { searchRecordsOnRefresh, onRefresh } = this.props;

          if (successMsg !== false) {
            message.success(successMsg || `${actionTitle}成功！`);
          }

          const isUpsert = ['addRecord', 'updateRecord'].indexOf(action) >= 0;

          if (shouldRefresh) {
            if (searchRecordsOnRefresh) {
              this.searchRecords().then(() => {
                if (blinkRecord && isUpsert) {
                  const matchRecord = resp.data || payload.record;

                  if (matchRecord) {
                    this.blinkRecordById(this.getRecordId(matchRecord));
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

      blinkRecordById = (id: any) => {
        const { dispatch } = this.props;
        dispatch({
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

      addRecord = (record: any, callback: (resp: any) => void) => {
        return this.callStoreAction({
          action: 'addRecord',
          actionForCount: 'upsertRecord',
          actionTitle: `创建${StoreNsTitle}`,
          payload: { record, callback },
        });
      };

      updateRecord = (record: any, callback: (resp: any) => void) => {
        return this.callStoreAction({
          action: 'updateRecord',
          actionForCount: 'upsertRecord',
          actionTitle: `编辑${StoreNsTitle} [${[
            this.getRecordId(record),
            this.getRecordName(record),
          ]
            .filter(item => !!item)
            .join('：')}] `,
          payload: {
            record,
            callback,
          },
        });
      };

      deleteRecord = (params: any, callback: (resp: any) => void) => {
        return this.callStoreAction({
          action: 'deleteRecord',
          actionTitle: `删除${StoreNsTitle}`,
          payload: { params, callback },
        });
      };

      onShowSizeChange = (current: number, pageSize: number) => {
        const { storeRef } = this.props;

        const { pagination } = storeRef;

        this.handleTableChange({ ...pagination, current: 1, pageSize });
      };

      showTotal = (total: number) => `共 ${total.toLocaleString('en')} 条`;

      handlePageNumChange = (current: number, pageSize: number) => {
        this.handleTableChange({ current, pageSize });
      };

      handleTableChange = (
        { current, pageSize }: { current: number; pageSize: number },
        filters?: any,
        sorter?: any,
      ) => {
        const { searchParams = {} } = this.props.storeRef;

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
          pageNum: current,
          pageSize,
        };

        const withUpdates = !isEqual(newSearchParams, searchParams);

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

      getRecordId = (record: any) => record && record[idFieldName];

      getRecordName = (record: any) => record && record[nameFieldName];

      getInsMethods = () => {
        const {
          getRecordName,
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
          getRecordId,
          getDefaultSearchParams,
          getSpecSearchParams,
          callStoreAction,
          callService,
          getLatestSearchParams,
          debouncedSearchRecords,
          getRecordModelPkg,
          getConfigModelPkg,
          blinkRecordById,
        } = this;

        return {
          getRecordName,
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
          getRecordId,
          getDefaultSearchParams,
          getSpecSearchParams,
          callStoreAction,
          callService,
          getLatestSearchParams,
          debouncedSearchRecords,
          getRecordModelPkg,
          getConfigModelPkg,
          blinkRecordById,
        };
      };

      render() {
        const {
          configLoading,
          placeholderIfConfigLoading,
          wrapperClassName,
          storeRef,
          configStoreRef,
          searchLoading,
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
          formNamePrefix,
          passContextAsProps,
          ...restProps
        } = this.props;

        if (configLoading && placeholderIfConfigLoading) {
          return placeholderIfConfigLoading === true ? (
            <Spin />
          ) : (
            placeholderIfConfigLoading
          );
        }

        const contextVal: IStandContextProps = {
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
          dispatch: this.props.dispatch,
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
          formNamePrefix,
          isStoreDataStale: !!(
            storeRef &&
            storeRef.mountId &&
            this.mountId !== storeRef.mountId
          ),
          mountId: this.mountId,

          ...this.getInsMethods(),
        };

        return (
          <div
            className={classNames(
              styles.container,
              {
                [styles.searchLoading]: searchLoading,
                [styles.configLoading]: configLoading,
                [styles.loading]:
                  searchLoading || configLoading || getActionCount() > 0,
              },
              wrapperClassName,
            )}
          >
            <StandContext.Provider value={contextVal}>
              <WrappedComponent
                {...restProps}
                {...(passContextAsProps ? contextVal : undefined)}
              />
            </StandContext.Provider>
          </div>
        );
      }
    }

    return StandConnectHoc(hocParams)(ActionCounterHoc()(Comp as any));
  };
}
