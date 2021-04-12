import React from 'react';
import { TableProps } from 'antd/es/table';
import { ModalProps } from 'antd/es/modal';
import FormItem from 'antd/es/form/FormItem';
import { FormInstance } from 'antd/es/form';
import { PaginationProps } from 'antd/es/pagination';
import { Dispatch } from 'dva';
import { Connect } from 'react-redux';

import standStyles from './StandRecordsHoc/styles';

export type TKey = string | number;

export type TFnAny = (...args: any[]) => any;

export type TAsyncFnAny = (...args: any[]) => Promise<any>;

export type TFnVoid = () => void;

export interface IGlobalConfig {
  getDvaApp?: () => DvaApp;
  getHistory?: () => History;
  getConnect?: () => Connect;
}

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
  data?: {
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
  StoreNs?: string;
  StoreNsTitle?: string;
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

export interface DvaApp {
  model: (model: any) => void;
  unmodel: (namespace: string) => void;
  _models: any[];
}

export interface History {
  push: TFnAny;
  location: any;
}

export interface IRecordsHocModelParams {
  /**
   * Normally returned by buildStandConfigModelPkg
   */
  configModel: IModelPkg;

  /**
   * Normally returned by buildStandRecordModelPkg
   */
  recordModel: IModelPkg;
}

export interface IRecordCommonHocParams extends IRecordsHocModelParams {
  /**
   * Whether sync search params to url
   */
  syncParamsToUrl?: boolean;
  /**
   * Url params namespace to avoid conflict
   */
  urlParamsNs?: false | string;
  /**
   * Url params to reserve when doing a new search
   */
  reservedUrlParamNames?: string[];
  /**
   * Default search params
   */
  defaultSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  /**
   * Special search params, which can not be overide
   */
  specSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;

  /**
   * Sorter params, normally from Table.onChange
   */
  sorterSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;
  /**
   * Filter params, normally from Table.onChange
   */
  filterSearchParams?: TCommonObjOrEmpty | TFnParamsFilter;

  /**
   * Do searchRecords in didMount, default true
   */
  searchRecordsOnMount?: boolean;

  /**
   * If configModel is loading, render this placeholder
   */
  placeholderIfConfigLoading?: boolean | React.ReactNode;

  /**
   * StandContext will be passed in props, default true
   */
  passContextAsProps?: boolean;

  /**
   * The className for the outer container wrapper
   */
  wrapperClassName?: string;
}
export interface IRecordsHocBaseParams extends IRecordCommonHocParams {
  updateSearchParamsEvenError?: boolean;
  passSearchWhenParamsEqual?: boolean;
  takeOverMount?: boolean;
  searchRecordsOnParamsChange?: boolean;
  searchRecordsOnRefresh?: boolean;
  finalSearchParamsFilter?: (params?: TCommonObjOrEmpty) => TCommonObjOrEmpty;
  formNamePrefix?: string;
  onRecordFormVisibleTagChange?: (recordFormVisibleTag: any) => void;
  onRefresh?: TFnVoid;
  callStoreActionPayloadFilter?: (action: string, payload: any) => void;
  getRecordMapByIdList?: (idList: any[]) => Promise<ICommonObj>;
}

export interface IRecordsHocParams extends IRecordsHocBaseParams {}
export interface IRecordsProps extends IRecordsHocBaseParams {
  location?: { search: string };
  dispatch: Dispatch<any>;
  storeRef: IStoreRef;
  configStoreRef: ICommonObj;
  searchLoading: boolean;
  configLoading: boolean;
}

export interface IIdSelCtrlHocParams<R> {
  checkedIdList?: TKey[];
  defaultCheckedIdList?: TKey[];
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
  onModalShow?: TFnVoid;
  onModalHide?: TFnVoid;
  onModalVisibleChange?: (v: boolean) => void;
  resetCheckedOnModalShow?: boolean;
  onModalOk?: (params: { checkedList: any[] }) => void;
  clearCheckedAfterClose?: boolean;
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
  clearChecked: TFnVoid;
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
  getActionCount: (action?: string | string[]) => number;
}

export interface IStandContextProps<R = any> extends IActionCounterHocProps {
  // Partial<IBatchCheckHocProps<R>>
  StoreNs: string;
  storeRef: IStoreRef;
  configStoreRef: ICommonObj;
  config: ICommonObj;
  searchLoading: boolean;
  configLoading: boolean;
  showEmptyRecordForm: TFnVoid;
  recordNsTitle: string;
  StoreNsTitle: string;
  getUrlParams: (specProps?: ICommonObj) => ICommonObj;
  clearActiveRecord: TFnVoid;
  hideRecordFormOnly: TFnVoid;
  hideRecordForm: TFnVoid;
  getRecordMapByIdList: (idList: any[]) => Promise<ICommonObj>;
  getRecord: (specParams?: ICommonObj) => Promise<any>;
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
  blinkRecordById: (id: any) => void;
  idFieldName: string;
  nameFieldName: string;

  /** @deprecated use callStoreAction instead */
  callAction: (
    action: string,
    actionTitle: string,
    payload: any,
    shouldRefresh: boolean,
  ) => Promise<any>;

  renderPagination: (params?: PaginationProps) => void;

  handleTableChange: TableProps<any>['onChange'];
  getRecordId: (record: R) => TKey;
  getRecordName: (record: R) => TKey;
  reloadSearch: TFnVoid;
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

export type TListCtrlProps<R> = IListCtrlProps<R> &
  IStandContextProps &
  IBatchCheckHocProps<R> &
  IBatchCheckProps<R>;

export type TRecordsHocCompProps = IRecordsHocBaseParams & ICommonObj;

export type TRecordsHocComp = React.ComponentType<TRecordsHocCompProps>;

export interface IFormHistroyTriggerProps {
  targetFormInfo: { formId: string; form: FormInstance; title: string };
  formValuesEncoder: {
    encode: (values: TCommonObjOrEmpty) => TCommonObjOrEmpty;
    decode: (values: TCommonObjOrEmpty) => TCommonObjOrEmpty;
  };
  historyRecordInfo: { nameFieldName: string };
}

export interface IUseStandSearchFormResult {
  formId: string;
  formHistroyTriggerProps: IFormHistroyTriggerProps;
  renderFormHistroyTrigger: () => React.ReactNode;
  formProps: {
    name: string;
    form: FormInstance;
    initialValues: ICommonObj;
    onFinish: (values: ICommonObj) => void;
  };
  config: ICommonObj;
  context: IStandContextProps;
  form: FormInstance;
  onFinish: (values: ICommonObj) => void;
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  FormItem: typeof FormItem;
}

export interface IUseStandUpsertFormResult {
  formId: string;
  formHistroyTriggerProps: IFormHistroyTriggerProps;
  renderFormHistroyTrigger: () => React.ReactNode;
  formProps: {
    name: string;
    form: FormInstance;
    initialValues: ICommonObj;
    onFinish: (values: ICommonObj) => void;
  };
  modalProps: {
    title: string;
    visible: boolean;
    onOk: TFnVoid;
    onCancel: TFnVoid;
    afterClose: TFnVoid;
  };
  /**
   * Normally passed by showRecordForm, and used as match condition in isModalVisible
   */
  recordFormVisibleTag: boolean | TKey;
  getInitValues: (record?: any) => ICommonObj;
  getInitValuesByRecord: (record: any) => ICommonObj;
  /**
   *  Update or Create
   *  isUpdate =  activeRecord && activeRecord[idFieldName]
   */
  isUpdate: boolean;
  activeRecord: ICommonObj;
  context: IStandContextProps;
  config: ICommonObj;
  form: FormInstance;
  onFinish: (values: ICommonObj) => void;
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  handleCancel: TFnVoid;
  clearActiveRecord: TFnVoid;
}

export interface IStandTableRenderParams extends TableProps<any> {
  hasPagination?: boolean;
  noFiltersForDisabledSearchParams?: boolean;
  autoScrollX?: boolean | { defaultWidth?: number; extraWidth?: number };
}

export interface IUseStandTableListResult {
  context: IStandContextProps;
  config: ICommonObj;
  records: any[];
  showRecordForm: IStandContextProps['showRecordForm'];
  loadAndShowRecordForm: IStandContextProps['loadAndShowRecordForm'];
  tableListStyles: typeof standStyles;
  tableListProps: TableProps<any>;
  searchLoading: boolean;
  standRender: (params: IStandTableRenderParams) => React.ReactElement;
}
