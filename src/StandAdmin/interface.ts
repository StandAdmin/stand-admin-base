import React from 'react';
import { TableProps } from 'antd/es/table';
import { ModalProps } from 'antd/es/modal';
import { Dispatch } from 'dva';

export type TKey = string | number;

export type TFnAny = (...args: any[]) => any;

export type TAsyncFnAny = (...args: any[]) => Promise<any>;

export interface ICommonObj {
  [key: string]: any;
}

export type TCommonObjOrEmpty = ICommonObj | undefined | null;

export type TFnParamsFilter = (...args: any[]) => TCommonObjOrEmpty;

export interface IResponse {
  success: boolean;
  message?: string;
  permissionApplyUrl?: string;
  data?: any;
  [key: string]: any;
}

export interface IResponseOfSearchRecords extends IResponse {
  data: {
    list?: any[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
    [key: string]: any;
  };
}

export interface IStandModelOptions {
  idFieldName?: string;
  nameFieldName?: string;
  fldsPathInResp?: {
    [key: string]: string[] | string;
  };
  searchParamsMap?: {
    [key: string]: string;
  };
  StoreNs: string;
  StoreNsTitle: string;
  searchRecords?: (params?: ICommonObj) => Promise<IResponseOfSearchRecords>;
  getRecord?: (params?: ICommonObj) => Promise<IResponse>;
  addRecord?: (record: ICommonObj) => Promise<IResponse>;
  updateRecord?: (record: ICommonObj) => Promise<IResponse>;
  deleteRecord?: (params: ICommonObj) => Promise<IResponse>;
  extensions?: any;
}

export interface IModelPkg {
  idFieldName?: string;
  nameFieldName?: string;
  StoreNsTitle?: string;
  StoreNs?: string;
  isDynamic?: boolean;
  modelOpts?: IStandModelOptions;
  default: any;
}

export type TGetConfigFn = () => Promise<ICommonObj>;

export type TGetConfigItem = TGetConfigFn | ICommonObj;

export interface IStandConfigModelOptions {
  StoreNsTitle?: string;
  StoreNs?: string;
  getConfig: TGetConfigItem | TGetConfigItem[];
}

export interface IStoreActionParams {
  action: string;
  actionForCount?: string;
  actionTitle?: string;
  payload?: any;
  shouldRefresh?: boolean;
  StoreNs?: string;
  handleActionResponse?: (resp: any, params: IStoreActionParams) => void;
  blinkRecord?: boolean;
  successMsg?: false | string;
}

export interface IServiceParams extends Omit<IStoreActionParams, 'action'> {
  serviceTitle: string;
  serviceFunction: TAsyncFnAny;
  serviceParams: any[];
}

export interface IPagination {
  total: number;
  current: number;
  pageSize: number;
}

export interface IStoreRef {
  mountId: TKey | null;
  idFieldName: string;
  nameFieldName: string;

  records: any[];
  searchParams: ICommonObj;
  pagination: IPagination;
  recordFormVisibleTag: boolean | TKey;

  blinkRecord?: TCommonObjOrEmpty;
  activeRecord?: TCommonObjOrEmpty;
  removingRecord?: TCommonObjOrEmpty;
}

export interface IRecordsHocModelParams {
  recordModel: IModelPkg;
  configModel: IModelPkg;
}

export interface DvaApp {
  model: (model: any) => void;
  unmodel: (namespace: string) => void;
  _models: any[];
}

export interface History {
  push: TFnAny;
  location: any;
}

export interface IConfigLoadingHocParams {
  configModel: IModelPkg;
  getConnect: () => TFnAny;
}
export interface IRecordsHocBaseParams {
  updateSearchParamsEvenError?: boolean;
  passSearchWhenParamsEqual?: boolean;
  syncParamsToUrl?: boolean;
  urlParamsNs?: false | string;
  searchRecordsOnMount?: boolean;
  searchRecordsOnParamsChange?: boolean;
  searchRecordsOnRefresh?: boolean;
  defaultSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  specSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  finalSearchParamsFilter?: (params?: TCommonObjOrEmpty) => TCommonObjOrEmpty;
  sorterSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  filterSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  reservedUrlParamNames?: string[];
  useLastSavedSearchParamsOnMount?: boolean;
  placeholderIfConfigLoading?: boolean | React.ReactNode;
  wrapperClassName?: string;
  formNamePrefix?: string;
  onRecordFormVisibleTagChange?: (recordFormVisibleTag: any) => void;
  onRefresh?: () => void;
  callStoreActionPayloadFilter?: (action: string, payload: any) => void;
  getDvaApp: () => DvaApp;
  getHistory: () => History;
  getConnect: () => TFnAny;
}

export interface IRecordsHocParams
  extends IRecordsHocBaseParams,
    IRecordsHocModelParams {}

export interface IRecordsProps extends IRecordsHocBaseParams {
  location?: { search: string };
  dispatch: Dispatch<any>;
  storeRef: IStoreRef;
  configStoreRef: IStoreRef;
  searchLoading: boolean;
  configLoading: boolean;
}

export interface IIdSelCtrlHocParams<R> {
  checkedIdList?: TKey[];
  getRecordMapByIdList?: (
    idList: TKey[],
  ) => Promise<
    {
      [key in TKey]: R;
    }
  >;
}

export interface IListCtrlHocParams<R>
  extends IRecordsHocParams,
    IIdSelCtrlHocParams<R> {
  isModalMode?: boolean;
  isStandListCtrl?: boolean;
  defaultModalVisible?: boolean;
  modalVisible?: boolean;
}

export interface IListCtrlProps<R> extends IListCtrlHocParams<R> {
  modalProps?: ModalProps;
  modalTrigger?: (...args: any[]) => React.ReactNode;
  modalTriggerDisabled?: boolean;
  modalTriggerTitle?: string;
  modalWrapperClassName?: string;
  modalTriggerClassName?: string;
  resetSearchParamsOnModalShow?: boolean;
  onModalShow?: () => void;
  onModalHide?: () => void;
  onModalVisibleChange?: (v: boolean) => void;
  resetCheckedOnModalShow?: boolean;
  onModalOk?: (params: { checkedList: any[] }) => void;
  clearCheckedAfterClose?: boolean;
  disableSpecSearchParams?: boolean;
}

export interface IBatchCheckProps<R> {
  defaultCheckedList?: R[];
  maxCheckedLength?: number;
  onChange?: (list: R[]) => void;
  checkedList?: R[];
  getRecordId?: (record: R) => any;
}

export interface IBatchCheckHocProps<R> {
  checkedList: R[];
  defaultCheckedList: R[];
  isAllChecked: (records: R[]) => boolean;
  isRecordChecked: (record: R) => boolean;
  setChecked: (records: R[]) => void;
  checkAll: (records: R[]) => void;
  uncheckAll: (records: R[]) => void;
  checkReverse: (records: R[]) => void;
  clearChecked: () => void;
  toggleChecked: (
    record: R,
    checked: boolean,
    callback?: (checkedList: R[]) => void,
  ) => void;
  batchToggleChecked: (records: R[], checked: boolean) => void;
  getCheckedList: () => R[];
}

export interface IActionCounterHocProps {
  increaseActionCount: (action?: string, num?: number) => void;
  decreaseActionCount: (action?: string, num?: number) => void;
  getActionCount: (action?: string) => number;
}

export interface IStandContextProps<R = any>
  extends IActionCounterHocProps,
    Partial<IBatchCheckHocProps<R>> {
  StoreNs: string;
  storeRef: IStoreRef;
  configStoreRef: ICommonObj;
  config: ICommonObj;
  searchLoading: boolean;
  configLoading: boolean;
  showEmptyRecordForm: () => void;
  recordNsTitle: string;
  StoreNsTitle: string;
  getUrlParams: (specProps?: ICommonObj) => ICommonObj;
  clearActiveRecord: () => void;
  hideRecordFormOnly: () => void;
  hideRecordForm: () => void;
  updateRecord: (record: R, callback?: (resp: any) => void) => Promise<any>;
  addRecord: (record: R, callback?: (resp: any) => void) => Promise<any>;
  showRecordForm: (activeRecord: any, recordFormVisibleTag?: any) => void;
  loadAndShowRecordForm: (params: any, recordFormVisibleTag?: any) => void;
  deleteRecord: (
    params: ICommonObj,
    callback?: (resp: any) => void,
  ) => Promise<any>;
  goSearch: (params?: ICommonObj) => void;
  getSearchParams: (specProps?: ICommonObj) => object;
  searchRecords: (specParams?: ICommonObj) => void;
  debouncedSearchRecords: (specParams?: ICommonObj) => void;
  idFieldName: string;
  nameFieldName: string;

  /** @deprecated use callStoreAction instead */
  callAction: (
    action: string,
    actionTitle: string,
    payload: any,
    shouldRefresh: boolean,
  ) => Promise<any>;

  renderPagination: (params?: any) => void;

  handleTableChange: TableProps<any>['onChange'];
  getRecordId: (record: R) => TKey;
  getRecordName: (record: R) => TKey;
  reloadSearch: () => void;
  dispatch: Dispatch<any>;

  getRecordModelPkg: () => IModelPkg;
  getConfigModelPkg: () => IModelPkg;

  getDefaultSearchParams: (specProps?: ICommonObj) => ICommonObj;
  getSpecSearchParams: (specProps?: ICommonObj) => ICommonObj;
  callStoreAction: (params: IStoreActionParams) => Promise<any>;
  callService: (params: IServiceParams) => Promise<any>;
  renderEmpty: () => React.ReactNode;
  formNamePrefix: string;
  getLatestSearchParams: () => ICommonObj;
  isStoreDataStale: boolean;
  mountId: TKey;
}
