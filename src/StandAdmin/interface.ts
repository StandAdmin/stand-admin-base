import React from 'react';
import { TableProps } from 'antd/es/table';
import { ModalProps } from 'antd/es/modal';
import FormItem from 'antd/es/form/FormItem';
import { FormInstance } from 'antd/es/form';
import { PaginationProps } from 'antd/es/pagination';
import { Dispatch, Model } from 'dva';
import { Connect } from 'react-redux';
import { UndefinedOptional } from './undefinedOptional';

import standStyles from './StandRecordsHoc/styles';

export type TKey = string | number;

export type TFnAny = (...args: any[]) => any;

export type TAsyncFnAny = (...args: any[]) => Promise<any>;

export type TFnVoid = () => void;

export type TRecordId = string | number;

export interface ICommonObj {
  [key: string]: any;
}

export type TEmpty = undefined | null;

export type TCommonObjOrEmpty = ICommonObj | TEmpty;

export type TRecordFormVisibleTag = boolean | TKey;

export type TSearchParams = ICommonObj;

export type TSearchParamsOrId = TSearchParams | TRecordId;

export type TFnParamsFilter = (...args: any[]) => TCommonObjOrEmpty;

export interface IGlobalConfig {
  getDvaApp: () => IDvaApp;
  getHistory: () => IHistory;
  getConnect: () => Connect;
}

export interface IResponse {
  success: boolean;
  message?: string;
  permissionApplyUrl?: string;
  data?: any;
  [key: string]: any;
}

export interface IResponseOfSearchRecords<R> extends IResponse {
  data?: {
    list?: R[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
    [key: string]: any;
  };
}

export interface IResponseOfGetRecord<R> extends IResponse {
  data: R;
}

export interface IResponseOfAction<R> extends IResponse {
  data?: R;
}

export interface IStandModelOptions<R> {
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
  isDynamic?: boolean;
  searchRecords?: (
    params?: TSearchParams,
  ) => Promise<IResponseOfSearchRecords<R>>;
  getRecord?: (params?: TSearchParamsOrId) => Promise<IResponseOfGetRecord<R>>;
  addRecord?: (record: ICommonObj) => Promise<IResponseOfAction<R>>;
  updateRecord?: (record: ICommonObj) => Promise<IResponseOfAction<R>>;
  deleteRecord?: (params: TSearchParams) => Promise<IResponseOfAction<R>>;
  extensions?: any;
}

export interface IModelPkg<R = any> {
  idFieldName?: string;
  nameFieldName?: string;
  StoreNsTitle?: string;
  StoreNs?: string;
  isDynamic?: boolean;
  modelOpts?: IStandModelOptions<R>;
  default: Model;
}

export type TStandConfigGetConfigFn = () => Promise<ICommonObj>;

export type TStandConfigGetConfigItem = TStandConfigGetConfigFn | ICommonObj;

export interface IStandConfigModelOptions {
  StoreNsTitle?: string;
  StoreNs?: string;
  getConfig?: TStandConfigGetConfigItem | TStandConfigGetConfigItem[];
}

export interface IStoreActionParams {
  action: string;
  actionForCount?: string;
  actionTitle?: string;
  payload?: any;
  shouldRefresh?: boolean;
  StoreNs?: string;
  handleActionResponse?: (
    resp: IResponseOfAction<any>,
    params: IStoreActionParams,
  ) => void;
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

export interface IStoreRef<R> {
  mountId: TKey | null;
  idFieldName: string;
  nameFieldName: string;

  records: R[];
  searchParams: TSearchParams;
  pagination: IPagination;
  recordFormVisibleTag: TRecordFormVisibleTag;

  blinkRecord: R | TEmpty;
  activeRecord: R | TEmpty;
  removingRecord: R | TEmpty;
}

export interface IDvaApp {
  model: (model: any) => void;
  unmodel: (namespace: string) => void;
  _models: any[];
}

export interface IHistory {
  push: TFnAny;
  location: any;
}

export interface IRecordsHocModelParams {
  /**
   * Normally returned by buildStandConfigModelPkg
   */
  configModel?: IModelPkg;

  /**
   * Normally returned by buildStandRecordModelPkg
   */
  recordModel?: IModelPkg;
}

export interface IRecordsHocCommonParams extends IRecordsHocModelParams {
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
  defaultSearchParams?: TSearchParams | TFnParamsFilter;
  /**
   * Special search params, which can not be overide
   */
  specSearchParams?: TSearchParams | TFnParamsFilter;

  /**
   * Sorter params, normally from Table.onChange
   */
  sorterSearchParams?: TSearchParams | TFnParamsFilter;
  /**
   * Filter params, normally from Table.onChange
   */
  filterSearchParams?: TSearchParams | TFnParamsFilter;

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
  receiveContextAsProps?: boolean | string[];

  /**
   * The className for the outer container wrapper
   */
  wrapperClassName?: string;

  /**
   * Row Select support for the standRender of useStandTableList
   */
  listRowSelectionSupport?: boolean;

  /**
   * If true, a new recordModel with new namespace will be created
   */
  makeRecordModelPkgDynamic?: string;
}
export interface IRecordsHocFullParams<R = any>
  extends IRecordsHocCommonParams {
  /**
   * HocParams will be passed in props, default true
   */
  receiveHocParamsAsProps?: boolean | string[];
  updateSearchParamsEvenError?: boolean;
  passSearchWhenParamsEqual?: boolean;
  takeOverMount?: boolean;
  searchRecordsOnParamsChange?: boolean;
  searchRecordsOnRefresh?: boolean;
  isSearchParamsEqual?: (paramsA: ICommonObj, paramsB: ICommonObj) => boolean;
  successHandler?: (params: {
    StoreNs: string;
    successMsg: string;
    action: string;
    actionTitle: string;
    payload: any;
    shouldRefresh: boolean;
  }) => void;
  finalSearchParamsFilter?: (params?: TSearchParams) => TSearchParams;
  formNamePrefix?: string;
  onRecordFormVisibleTagChange?: (
    recordFormVisibleTag: TRecordFormVisibleTag,
  ) => void;
  onRefresh?: TFnVoid;
  callStoreActionPayloadFilter?: (action: string, payload: any) => void;
  getRecordMapByIdList?: (
    idList: TRecordId[],
  ) => Promise<
    {
      [key in TRecordId]: R;
    }
  >;
}

export interface IStandConnectInjectProps<R> {
  storeRef: IStoreRef<R>;
  configStoreRef: ICommonObj;
  searchLoading: boolean;
  configLoading: boolean;
  dispatch: Dispatch<any>;
}

export interface IRecordsHocInjectProps<R = any> {
  isStandAdminHoc: boolean;
  getStandContext: () => IStandContextProps<R>;
}

export interface IRecordsContextMethods<R> {
  getRecordMapByIdList: (
    idList: TRecordId[],
  ) => Promise<
    {
      [key in TRecordId]: R;
    }
  >;

  getUrlParams: (specProps?: TSearchParams) => ICommonObj;
  showEmptyRecordForm: TFnVoid;
  showRecordForm: (
    activeRecord?: R | TEmpty,
    recordFormVisibleTag?: TRecordFormVisibleTag,
  ) => void;
  loadAndShowRecordForm: (
    params: TSearchParamsOrId,
    recordFormVisibleTag?: TRecordFormVisibleTag,
  ) => void;
  goSearch: (params?: TSearchParams) => void;
  getSearchParams: (specProps?: ICommonObj) => object;
  searchRecords: (
    specParams?: ICommonObj,
  ) => Promise<IResponseOfSearchRecords<R>>;
  debouncedSearchRecords: (specParams?: ICommonObj) => void;
  blinkRecordById: (id: TRecordId) => void;

  getRecord: (specParams?: TSearchParams) => Promise<R>;
  updateRecord: (
    record: R,
    callback?: (resp: IResponseOfAction<R>) => void,
  ) => Promise<IResponseOfAction<R>>;
  addRecord: (
    record: R,
    callback?: (resp: IResponseOfAction<R>) => void,
  ) => Promise<IResponseOfAction<R>>;
  deleteRecord: (
    params: ICommonObj,
    callback?: (resp: IResponseOfAction<R>) => void,
  ) => Promise<IResponseOfAction<R>>;

  clearActiveRecord: TFnVoid;
  hideRecordFormOnly: TFnVoid;
  hideRecordForm: TFnVoid;

  /** @deprecated use callStoreAction instead */
  callAction: (
    action: string,
    actionTitle: string,
    payload: any,
    shouldRefresh: boolean,
  ) => Promise<any>;

  renderPagination: (params?: PaginationProps) => void;

  handleTableChange: TableProps<R>['onChange'];
  getRecordId: (record: R) => TRecordId;
  getRecordName: (record: R) => any;
  reloadSearch: TFnVoid;
  getRecordModelPkg: () => IModelPkg;
  getConfigModelPkg: () => IModelPkg;

  getDefaultSearchParams: (specProps?: IRecordsHocProps<R>) => ICommonObj;
  getSpecSearchParams: (specProps?: IRecordsHocProps<R>) => ICommonObj;
  callStoreAction: (params: IStoreActionParams) => Promise<IResponse>;
  callService: (params: IServiceParams) => Promise<IResponse>;
  renderEmpty: () => React.ReactNode;
  getLatestSearchParams: () => TSearchParams;
}

export interface IRecordsHocProps<R>
  extends IRecordsHocFullParams<R>,
    IBatchCheckHocProps<R> {
  location?: { search: string };
}

export interface IListCtrlHocParams<R> extends IRecordsHocFullParams<R> {
  isModalMode?: boolean;
  isStandListCtrl?: boolean;
  defaultModalVisible?: boolean;
  modalVisible?: boolean;
  clearCheckedAfterClose?: boolean;
  resetSearchParamsOnModalShow?: boolean;
  resetCheckedOnModalShow?: boolean;
}

export interface ModalTriggerOpts<R> {
  props: IListCtrlHocProps<R>;
  showModal: () => void;
  hideModal: () => void;
  toggleVisible: (v: boolean) => void;
  context: IStandContextProps<R>;
}

export interface IListCtrlHocInjectProps<R = any>
  extends IRecordsHocInjectProps<R> {
  isModalMode: boolean;
  toggleModalVisible?: (v: boolean) => void;
}
export interface IListCtrlHocProps<R>
  extends IListCtrlHocParams<R>,
    IRecordsHocProps<R> {
  modalProps?: ModalProps;
  modalTrigger?: (
    opts: ModalTriggerOpts<R>,
  ) => React.ReactNode | React.ReactNode;
  modalTriggerDisabled?: boolean;
  modalTriggerTitle?: string;
  modalWrapperClassName?: string;
  modalTriggerClassName?: string;
  onModalShow?: TFnVoid;
  onModalHide?: TFnVoid;
  onModalVisibleChange?: (v: boolean) => void;
  onModalOk?: (params: { checkedList: R[] }) => void;
}

export interface IIdSelectCtrlHocProps<R = any>
  extends Omit<IListCtrlHocProps<R>, 'onChange'> {
  checkedIdList?: TRecordId[];
  defaultCheckedIdList?: TRecordId[];
  onChangeWithData?: (list: R[]) => void;
  onChange?: (list: TRecordId[]) => void;
}

export interface IRecordInfoHocInjectProps<R = any>
  extends IRecordsHocInjectProps<R> {
  recordInfoLoading: boolean;
  recordInfo: R;
}

export interface IBatchCheckHocProps<R> {
  defaultCheckedList?: R[];
  maxCheckedLength?: number;
  onChange?: (list: R[]) => void;
  checkedList?: R[];
}
export interface IBatchCheckHocInjectProps<R> {
  checkedList: R[];
  isAllChecked: (records: R[]) => boolean;
  isRecordChecked: (record: R) => boolean;
  setChecked: (records: R[]) => void;
  checkAll: (records: R[]) => void;
  uncheckAll: (records: R[]) => void;
  checkReverse: (records: R[]) => void;
  clearChecked: TFnVoid;
  toggleChecked: (record: R | R[], checked: boolean) => void;
  batchToggleChecked: (records: R[], checked: boolean) => void;
  getCheckedList: () => R[];
}

export interface IActionCounterHocInjectProps {
  increaseActionCount: (action?: string, num?: number) => void;
  decreaseActionCount: (action?: string, num?: number) => void;
  getActionCount: (action?: string | string[]) => number;
}

export interface IStandContextProps<R = any>
  extends IActionCounterHocInjectProps,
    IBatchCheckHocInjectProps<R>,
    IRecordsContextMethods<R> {
  StoreNs: string;
  storeRef: IStoreRef<R>;

  /** @deprecated use config instead */
  configStoreRef: ICommonObj;

  config: ICommonObj;
  searchLoading: boolean;
  configLoading: boolean;
  recordNsTitle: string;
  StoreNsTitle: string;
  idFieldName: string;
  nameFieldName: string;
  dispatch: Dispatch<any>;
  formNamePrefix: string;
  isStoreDataStale: boolean;
  mountId: TKey;
}

export type TRecordsHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & IRecordsHocProps<R>
>;

export type TIdSelectCtrlHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & IIdSelectCtrlHocProps<R>
>;

export type TListCtrlHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & IListCtrlHocProps<R>
> & {
  IdSelectCtrl: TIdSelectCtrlHocComponent<R, P>;
};

export interface ITargetFormInfo {
  formId: string;
  form: FormInstance;
  title: string;
}

export interface IFormHistroyTriggerProps {
  targetFormInfo: ITargetFormInfo;
  historyRecordInfo: { nameFieldName: string };
  formValuesEncoder?: {
    encode?: (vals: any) => any;
    decode?: (vals: any) => any;
  };
  actionHooks?: { afterRestore: (vals: any) => any };
}

export type TRenderFormHistroyTriggerOpts =
  | Partial<IFormHistroyTriggerProps>
  | ((props: IFormHistroyTriggerProps) => Partial<IFormHistroyTriggerProps>);

export interface IUseStandSearchFormResult<R> {
  formId: string;
  renderFormHistroyTrigger: (
    opts?: TRenderFormHistroyTriggerOpts,
  ) => React.ReactNode;
  formProps: {
    name: string;
    form: FormInstance;
    initialValues: ICommonObj;
    onFinish: (values: ICommonObj) => void;
  };
  config: ICommonObj;
  context: IStandContextProps<R>;
  form: FormInstance;
  onFinish: (values: ICommonObj) => void;
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  FormItem: typeof FormItem;
}

export interface IUseStandUpsertFormResult<R> {
  formId: string;
  renderFormHistroyTrigger: (
    opts?: TRenderFormHistroyTriggerOpts,
  ) => React.ReactNode;
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
  recordFormVisibleTag: TRecordFormVisibleTag;

  getInitValues: (record?: R) => ICommonObj;
  getInitValuesByRecord: (record: R) => ICommonObj;

  /**
   *  Update or Create
   *  isUpdate =  activeRecord && activeRecord[idFieldName]
   */
  isUpdate: boolean;

  activeRecord: R | TEmpty;
  context: IStandContextProps<R>;
  config: ICommonObj;
  form: FormInstance;
  onFinish: (values: ICommonObj) => void;
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  handleCancel: TFnVoid;
  clearActiveRecord: TFnVoid;
}

export interface IStandTableRenderParams<R> extends TableProps<R> {
  hasPagination?: PaginationProps | boolean;
  noFiltersForDisabledSearchParams?: boolean;
  autoScrollX?: boolean | { defaultWidth?: number; extraWidth?: number };
}

export interface IUseStandTableListResult<R> {
  context: IStandContextProps<R>;
  config: ICommonObj;
  records: R[];
  showRecordForm: IStandContextProps['showRecordForm'];
  loadAndShowRecordForm: IStandContextProps['loadAndShowRecordForm'];
  tableListStyles: typeof standStyles;
  tableListProps: TableProps<R>;
  searchLoading: boolean;
  standRender: (params: IStandTableRenderParams<R>) => React.ReactElement;
}
