import type React from 'react';

import type { Dispatch, Model } from 'dva';
import type { Connect } from 'react-redux';

import type {
  TableProps,
  ModalProps,
  FormProps,
  FormItem,
  FormInstance,
  PaginationProps,
} from '../UI/interface';

import type { UndefinedOptional } from './undefinedOptional';

import type standStyles from './Admin/styles';
import type { TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type { DebouncedFunc } from 'lodash';

export type DvaModel = Model;

export type TKey = string | number;

export type TFnAny = (...args: any[]) => any;

export type TAsyncFnAny<R = any> = (...args: any[]) => Promise<R>;

export type TFnVoid = () => void;

export type TRecordId = string | number;

export type TCommonObj = Record<string, any>;

export type TEmpty = undefined | null;

export type TRecordOrEmpty = TCommonObj | TEmpty;

export type TRecordFormVisibleTag = boolean | TKey | TCommonObj;

export type TSearchParams = TCommonObj;

export type TSearchParamsOrId = TSearchParams | TRecordId;

export type TFnParamsFilter = (...args: any[]) => TRecordOrEmpty;

export type TGlobalConfig = {
  getDvaApp: () => IDvaApp;
  getHistory: () => IHistory;
  getConnect: () => Connect;
};

export type IResponse = TCommonObj & {
  success: boolean;
  message?: string;
  permissionApplyUrl?: string;
  data?: any;
};

export type IResponseOfSearchRecords<R> = IResponse & {
  data?: {
    list?: R[];
    total?: number;
    pageNum?: number;
    pageSize?: number;
    [key: string]: any;
  };
};

export type IResponseOfGetRecord<R> = IResponse & {
  data: R;
};

export type IResponseOfAction<R> = IResponse & {
  data?: R;
};

export type TResponseOfActionHandler<R> = (resp: IResponseOfAction<R>) => void;

export type TSearchParamsMapKeys = 'pageNum' | 'pageSize';

export type TFldsPathInRespMapKeys =
  | 'pageNum'
  | 'pageSize'
  | 'total'
  | 'list'
  | 'errorMsg'
  | 'permissionApplyUrl';

export type TFldsPathInRespMapValueItem =
  | string
  | ((resp: TCommonObj, field: string) => any);

export type TFldsPathInRespMapValue =
  | TFldsPathInRespMapValueItem
  | TFldsPathInRespMapValueItem[];

export type IStandModelOptions<R> = {
  idFieldName?: string;
  nameFieldName?: string;
  fldsPathInResp?: {
    [key in TFldsPathInRespMapKeys]?: TFldsPathInRespMapValue;
  };
  searchParamsMap?: {
    [key in TSearchParamsMapKeys]?: string;
  };
  StoreNs?: string;
  StoreNsTitle?: string;
  isDynamic?: boolean;
  searchRecords?: (
    params?: TSearchParams
  ) => Promise<IResponseOfSearchRecords<R>>;
  getRecord?: (params?: TSearchParamsOrId) => Promise<IResponseOfGetRecord<R>>;
  addRecord?: (record: TCommonObj) => Promise<IResponseOfAction<R>>;
  updateRecord?: (record: TCommonObj) => Promise<IResponseOfAction<R>>;
  deleteRecord?: (params: TSearchParams) => Promise<IResponseOfAction<R>>;
  extensions?: any;
};

export type IModelPkg<R = any> = {
  idFieldName?: string;
  nameFieldName?: string;
  StoreNsTitle?: string;
  StoreNs?: string;
  isDynamic?: boolean;
  modelOpts?: IStandModelOptions<R>;
  default: DvaModel;
};

export type TStandConfigGetConfigFn = () => Promise<TCommonObj>;

type TStandConfigGetConfigSingleItem = TStandConfigGetConfigFn | TCommonObj;

export type TStandConfigGetConfigItem =
  | TStandConfigGetConfigSingleItem
  | TStandConfigGetConfigSingleItem[];

export type IStandConfigModelOptions = {
  StoreNsTitle?: string;
  StoreNs?: string;
  getConfig?: TStandConfigGetConfigItem;
};

export type IStoreActionParams = {
  action: string;
  actionForCount?: string;
  actionTitle?: React.ReactNode;
  payload?: any;
  shouldRefresh?: boolean;
  StoreNs?: string;
  handleActionResponse?: (
    resp: IResponseOfAction<any>,
    params: IStoreActionParams
  ) => void;
  blinkRecord?: boolean;
  successMsg?: false | string;
};

export type IServiceParams = Omit<
  IStoreActionParams,
  'action' | 'actionTitle' | 'payload' | 'StoreNs'
> & {
  serviceTitle: string;
  serviceFunction: TAsyncFnAny<IResponse>;
  serviceParams: any[];
};

export type IPagination = {
  total: number;
  current: number;
  pageSize: number;
};

export type IStoreRef<R> = {
  mountId: TKey | null;
  idFieldName: string;
  nameFieldName: string;

  records: R[];
  extraPayload: any;
  searchParams: TSearchParams;
  pagination: IPagination;
  recordFormVisibleTag: TRecordFormVisibleTag;

  blinkRecord: R | TEmpty;
  activeRecord: R | TEmpty;
  removingRecord: R | TEmpty;
};

export type IDvaApp = {
  model: (model: any) => void;
  unmodel: (namespace: string) => void;
  _models: any[];
};

export type IHistory = {
  push: TFnAny;
  location: any;
};

export type IContextHocModelParams = {
  /**
   * Normally returned by buildStandConfigModelPkg
   */
  configModel?: IModelPkg;

  /**
   * Normally returned by buildStandRecordModelPkg
   */
  recordModel?: IModelPkg;
};

export type IContextHocCommonParams = IContextHocModelParams & {
  /**
   * Whether sync search params to url
   */
  syncParamsToUrl?: boolean | 'auto';
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
   *  Trigger searchRecord in didMount, default true
   */
  searchRecordsOnMount?: boolean;

  /**
   *  Trigger searchRecord if params change, default true
   */
  searchRecordsOnParamsChange?: boolean;

  /**
   * If configModel is loading, render this placeholder
   */
  placeholderIfConfigLoading?: boolean | React.ReactNode;

  /**
   * StandContext will be passed in props
   */
  receiveContextAsProps?: boolean | (keyof IStandContextProps)[];

  /**
   * HocParams will be passed in props
   */
  receiveHocParamsAsProps?: boolean | (keyof IContextHocFullParams)[];

  /**
   * The className for the outer container wrapper
   */
  wrapperClassName?: string;

  wrapperStyle?: React.CSSProperties;

  /**
   * Row Select support for the standRender of useStandTableList
   */
  listRowSelectionSupport?: boolean;

  /**
   * A new recordModel with new namespace will be created if not empty
   */
  makeRecordModelPkgDynamic?: string;

  resetStoreStateWhenUnmount?: boolean;
  resetStoreStateWhenMount?: boolean;
};
export type IContextHocFullParams<R = any> = IContextHocCommonParams & {
  updateSearchParamsEvenError?: boolean;
  passSearchWhenParamsEqual?: boolean;
  passSearchUpdateIfStoreStale?: boolean;
  takeOverMount?: boolean;
  searchRecordsOnRefresh?: boolean;
  isSearchParamsEqual?: (paramsA: TCommonObj, paramsB: TCommonObj) => boolean;
  successHandler?: (params: {
    StoreNs: string;
    successMsg?: string;
    action: string;
    actionTitle: React.ReactNode;
    payload: any;
    shouldRefresh: boolean;
  }) => void;
  finalSearchParamsFilter?: (params?: TSearchParams) => TSearchParams;
  formNamePrefix?: string;
  onRecordFormVisibleTagChange?: (
    recordFormVisibleTag: IStoreRef<R>['recordFormVisibleTag']
  ) => void;
  onRefresh?: TFnVoid;
  callStoreActionPayloadFilter?: (action: string, payload: any) => void;
  getRecordMapByIdList?: (idList: TRecordId[]) => Promise<{
    [key in TRecordId]: R;
  }>;
};

export type IStandConnectInjectProps<R> = {
  storeRef: IStoreRef<R>;
  configStoreRef: TCommonObj;
  searchLoading: boolean;
  configLoading: boolean;
  dispatch: Dispatch<any>;
};

export type IContextHocInjectProps<R = any> = {
  isStandAdminHoc: boolean;
  getStandContext: () => IStandContextProps<R>;
};

export type IContextMethods<R> = {
  getRecordMapByIdList: (idList: TRecordId[]) => Promise<{
    [key in TRecordId]: R;
  }>;

  getUrlParams: (specProps?: TSearchParams) => TCommonObj;
  showEmptyRecordForm: TFnVoid;
  showRecordForm: (
    activeRecord?: R | TEmpty,
    recordFormVisibleTag?: IStoreRef<R>['recordFormVisibleTag']
  ) => void;
  loadAndShowRecordForm: (
    params: TSearchParamsOrId,
    recordFormVisibleTag?: IStoreRef<R>['recordFormVisibleTag'],
    opts?: { showLoadingModal: boolean; recordFilter?: (record: any) => R }
  ) => void;
  goSearch: (
    params?: TSearchParams
  ) => Promise<IResponseOfSearchRecords<R> | string>;
  getSearchParams: (specProps?: TCommonObj) => object;
  searchRecords: (
    specParams?: TCommonObj
  ) => Promise<IResponseOfSearchRecords<R>>;

  debouncedSearchRecords: DebouncedFunc<IContextMethods<R>['searchRecords']>;

  reloadSearch: IContextMethods<R>['searchRecords'];

  blinkRecordById: (id: TRecordId) => void;

  getRecord: (specParams?: TSearchParamsOrId) => Promise<R>;
  updateRecord: (
    record: R,
    opts?: IStoreActionParams | TResponseOfActionHandler<R>
  ) => Promise<IResponseOfAction<R>>;
  addRecord: (
    record: R,
    opts?: IStoreActionParams | TResponseOfActionHandler<R>
  ) => Promise<IResponseOfAction<R>>;
  deleteRecord: (
    params: TCommonObj,
    opts?: IStoreActionParams | TResponseOfActionHandler<R>
  ) => Promise<IResponseOfAction<R>>;

  clearActiveRecord: TFnVoid;

  /** @deprecated use hideRecordForm instead */
  hideRecordFormOnly: TFnVoid;

  hideRecordForm: TFnVoid;

  /** @deprecated use callStoreAction instead */
  callAction: (
    action: string,
    actionTitle: string,
    payload: any,
    shouldRefresh: boolean
  ) => Promise<any>;

  renderPagination: (params?: PaginationProps) => React.ReactNode;

  handleTableChange: (
    pagination: TablePaginationConfig,
    filters?: Record<string, FilterValue | null>,
    sorter?: SorterResult<R> | SorterResult<R>[]
  ) => void;
  getRecordId: (record: R) => TRecordId;
  getRecordName: (record: R) => React.ReactNode;

  getRecordModelPkg: () => IModelPkg;
  getConfigModelPkg: () => IModelPkg;

  getDefaultSearchParams: (specProps?: IContextHocProps<R>) => TCommonObj;
  getSpecSearchParams: (specProps?: IContextHocProps<R>) => TCommonObj;
  callStoreAction: (params: IStoreActionParams) => Promise<IResponse>;
  callService: (params: IServiceParams) => Promise<IResponse>;

  /** @deprecated */
  renderEmpty: () => React.ReactNode;

  getLatestSearchParams: () => TSearchParams;

  updateConfig: (
    getConfig: TStandConfigGetConfigItem,
    updateConfigLoading?: boolean
  ) => Promise<TCommonObj>;
};

export type IContextHocProps<R> = IContextHocFullParams<R> &
  IBatchCheckHocProps<R> & {
    location?: { search: string };
  };

export type ISelectCtrlHocParams<R> = IContextHocFullParams<R> & {
  isModalMode?: boolean;
  isStandListCtrl?: boolean;
  defaultModalVisible?: boolean;
  modalVisible?: boolean;
  resetSearchParamsOnModalShow?: boolean;
  resetCheckedOnModalShow?: boolean;
  clearCheckedAfterClose?: boolean;
};

export type IModalTriggerOpts<R> = {
  props: ISelectCtrlHocProps<R>;
  showModal: () => void;
  hideModal: () => void;

  /** @deprecated use toggleModalVisible instead */
  toggleVisible: (visible: boolean) => void;

  toggleModalVisible: (visible: boolean) => void;
  context: IStandContextProps<R>;
};

export type TModalTriggerRender<R> = (
  opts: IModalTriggerOpts<R>
) => React.ReactNode | React.ReactNode;

export type ISelectCtrlHocInjectProps<R = any> = IContextHocInjectProps<R> & {
  isModalMode: boolean;
  toggleModalVisible?: (visible: boolean) => void;
};
export type ISelectCtrlHocProps<R> = ISelectCtrlHocParams<R> &
  IContextHocProps<R> & {
    modalProps?: ModalProps;
    modalTrigger?: TModalTriggerRender<R>;
    modalTriggerButtonRender?: TModalTriggerRender<R>;
    modalTriggerCheckedListRender?: TModalTriggerRender<R>;
    modalTriggerDisabled?: boolean;
    modalTriggerTitle?: string;
    modalWrapperClassName?: string;
    modalTriggerClassName?: string;
    onModalShow?: TFnVoid;
    onModalHide?: TFnVoid;
    onModalVisibleChange?: (visible: boolean) => void;
    onModalOk?: (params: { checkedList: R[] }) => void;
  };

export type IIdSelectCtrlHocProps<R = any> = Omit<
  ISelectCtrlHocProps<R>,
  'onChange'
> & {
  checkedIdList?: TRecordId[];
  defaultCheckedIdList?: TRecordId[];
  onChangeWithData?: (list: R[]) => void;
  onChange?: (list: TRecordId[]) => void;
};

export type IRecordInfoHocInjectProps<R = any> = IContextHocInjectProps<R> & {
  recordInfoLoading: boolean;
  recordInfo: R;
};

export type IBatchCheckHocProps<R> = {
  defaultCheckedList?: R[];
  maxCheckedLength?: number;
  onChange?: (list: R[]) => void;
  checkedList?: R[];
};
export type IBatchCheckHocInjectProps<R> = {
  checkedList: R[];
  isAllChecked: (records: R[]) => boolean;
  isChecked: (record: R) => boolean;
  setChecked: (records: R[]) => void;
  checkAll: (records: R[]) => void;
  uncheckAll: (records: R[]) => void;
  checkReverse: (records: R[]) => void;
  clearChecked: TFnVoid;
  toggleChecked: (record: R | R[], checked: boolean) => void;
  getCheckedList: () => R[];

  /** @deprecated use isChecked instead */
  isRecordChecked: (record: R) => boolean;

  /** @deprecated use toggleChecked instead */
  batchToggleChecked: (records: R[], checked: boolean) => void;
};

export type IActionCounterHocInjectProps = {
  increaseActionCount: (action?: string, num?: number) => void;
  decreaseActionCount: (action?: string, num?: number) => void;
  getActionCount: (action?: string | string[]) => number;
};

export type IStandContextProps<R = any> = IActionCounterHocInjectProps &
  IBatchCheckHocInjectProps<R> &
  IContextMethods<R> & {
    StoreNs: string;
    storeRef: IStoreRef<R>;

    /** @deprecated use config instead */
    configStoreRef: TCommonObj;

    config: TCommonObj;
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
  };

export type TContextHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & IContextHocProps<R>
>;

export type TIdSelectCtrlHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & IIdSelectCtrlHocProps<R>
>;

export type TSelectCtrlHocComponent<R = any, P = any> = React.ComponentType<
  UndefinedOptional<P> & ISelectCtrlHocProps<R>
> & {
  IdSelectCtrl: TIdSelectCtrlHocComponent<R, P>;
};

export type ITargetFormInfo = {
  formId: string;
  form: FormInstance;
  title: string;
};

export type IFormHistroyTriggerProps = {
  wrapperClassName?: string;
  historySaveTrigger?: (opts: { showSaveForm: () => void }) => React.ReactNode;
  historyListTrigger?: (opts: { showListModal: () => void }) => React.ReactNode;
  targetFormInfo: ITargetFormInfo;
  historyRecordInfo: { nameFieldName: string };
  formValuesEncoder?: {
    encode?: (vals: any) => any;
    decode?: (vals: any) => any;
  };
  formValuesFilter?: {
    beforeSave: (vals: any) => any;
    beforeRestore: (vals: any) => any;
  };
  actionHooks?: { afterRestore: (vals: any) => any };
};

export type TRenderFormHistroyTriggerOpts =
  | Partial<IFormHistroyTriggerProps>
  | ((props: IFormHistroyTriggerProps) => Partial<IFormHistroyTriggerProps>);

export type IUseStandSearchFormResult<R> = {
  formId: string;
  renderFormHistroyTrigger: (
    opts?: TRenderFormHistroyTriggerOpts
  ) => React.ReactNode;
  formProps: Pick<FormProps, 'name' | 'form' | 'initialValues' | 'onFinish'>;
  config: TCommonObj;
  context: IStandContextProps<R>;
  form: IUseStandSearchFormResult<R>['formProps']['form'];
  onFinish: IUseStandSearchFormResult<R>['formProps']['onFinish'];
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  FormItem: typeof FormItem;
};

export type IUseStandUpsertFormResult<R> = {
  formId: string;
  renderFormHistroyTrigger: (
    opts?: TRenderFormHistroyTriggerOpts
  ) => React.ReactNode;
  formProps: Pick<FormProps, 'name' | 'form' | 'initialValues' | 'onFinish'>;
  modalProps: Pick<
    ModalProps,
    'title' | 'visible' | 'onOk' | 'onCancel' | 'afterClose'
  >;

  /**
   * Normally passed by showRecordForm, and used as match condition in isModalVisible
   */
  recordFormVisibleTag: IStoreRef<R>['recordFormVisibleTag'];

  getInitValues: (record?: R) => TCommonObj;
  getInitValuesByRecord: (record: R) => TCommonObj;

  /**
   *  Update or Create
   *  isUpdate =  activeRecord && activeRecord[idFieldName]
   */
  isUpdate: boolean;

  activeRecord: R | TEmpty;
  activeRecordId: TRecordId;
  context: IStandContextProps<R>;
  config: TCommonObj;
  form: FormInstance;
  onFinish: (values: TCommonObj) => void;
  submitForm: TFnVoid;
  resetForm: TFnVoid;
  clearActiveRecord: TFnVoid;

  /** @deprecated use modalProps.onCancel instead */
  handleCancel: TFnVoid;
};

export type IStandTableRenderParams<R> = TableProps<R> & {
  hasPagination?: PaginationProps | boolean;
  noFiltersForDisabledSearchParams?: boolean;
  autoScrollX?: boolean | { defaultWidth?: number; extraWidth?: number };
};

export type IUseStandTableListResult<R> = {
  context: IStandContextProps<R>;
  config: TCommonObj;
  records: R[];
  showRecordForm: IStandContextProps['showRecordForm'];
  loadAndShowRecordForm: IStandContextProps['loadAndShowRecordForm'];
  tableListStyles: typeof standStyles;
  tableListProps: TableProps<R>;
  searchLoading: boolean;
  standRender: (params: IStandTableRenderParams<R>) => JSX.Element;
};
