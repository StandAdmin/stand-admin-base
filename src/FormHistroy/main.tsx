/* eslint-disable react/jsx-curly-newline */
import React from 'react';

import {
  StandListCtrlHoc,
  StandRecordsHoc,
  defineCommonHocParams,
} from '../StandAdmin/StandRecordsHoc';

import { useStandContext } from '../StandAdmin/StandRecordsHoc/hooks/useStandContext';

import {
  buildStandRecordModelPkg,
  buildStandConfigModelPkg,
} from '../StandAdmin/standModelHelper';

// import ToolBar from './ToolBar';
import List from './List';
import RecordForm from './RecordForm';

import { IFormHistroyTriggerProps, IHistoryRecord } from './interface';

import {
  ICommonObj,
  IListCtrlHocInjectProps,
  IRecordsHocCommonParams,
  IStandContextProps,
} from '../StandAdmin/interface';

import {
  searchRecords,
  // getRecord,
  addRecord,
  updateRecord,
  deleteRecord,
} from './service';

// 创建ConfigModel
export const configModel = buildStandConfigModelPkg({
  StoreNs: 'StandAdminFormHistroyConfig',
  StoreNsTitle: 'FormHistroyConfig',
  getConfig: [
    // // 静态变量
    // {
    //   boolMap: {
    //     0: 'No',
    //     1: 'Yes',
    //   },
    // },
  ],
});

// 创建RecordModel
export const recordModel = buildStandRecordModelPkg({
  StoreNs: 'StandAdminFormHistroyRecords',
  StoreNsTitle: '表单草稿',
  idFieldName: 'id',
  nameFieldName: 'name',
  searchRecords,
  // getRecord,
  addRecord,
  updateRecord,
  deleteRecord,

  // fldsPathInResp: {
  //   pageNum: 'data.pageNum',
  //   pageSize: 'data.pageSize',
  //   total: 'data.total',
  //   list: 'data.list',
  // },
  // searchParamsMap: {
  //   pageNum: 'pageNum',
  //   pageSize: 'pageSize',
  // },
});

function MainComp(
  props: IFormHistroyTriggerProps & IListCtrlHocInjectProps<IHistoryRecord>,
) {
  // const { config } = useStandContext();

  return (
    <>
      {/* <ToolBar {...props} /> */}
      {/* 结果列表 */}
      <List {...props} />

      {/* 新建/编辑 */}
      <RecordForm {...props} />
    </>
  );
}

export function RecordFormWrapper(
  props: IFormHistroyTriggerProps & {
    trigger: (context: IStandContextProps<IHistoryRecord>) => React.ReactNode;
  },
) {
  const context = useStandContext<IHistoryRecord>();

  const { trigger } = props;

  return (
    <>
      {trigger(context)}
      <RecordForm {...props} />
    </>
  );
}

const hocParams = defineCommonHocParams({
  recordModel,
  configModel,

  syncParamsToUrl: false,
  receiveContextAsProps: false,
  /**
   * 默认的查询参数
   */
  // defaultSearchParams: {},
});

const DynamicCompCache: ICommonObj = {};

// 动态主组件，支持不同的数据空间
export const getDynamicComp = (
  namespace: string,
  {
    Comp = MainComp,
    isListCtrl = true,
    extraHocParams,
  }: {
    isListCtrl?: boolean;
    Comp?: React.ComponentType<any>;
    extraHocParams?: IRecordsHocCommonParams;
  } = {},
) => {
  if (!DynamicCompCache[namespace]) {
    const hocWrapper = isListCtrl ? StandListCtrlHoc : StandRecordsHoc;

    DynamicCompCache[namespace] = (hocWrapper as any)({
      ...hocParams,
      makeRecordModelPkgDynamic: namespace,
      ...extraHocParams,
    })(Comp);
  }

  return DynamicCompCache[namespace];
};
