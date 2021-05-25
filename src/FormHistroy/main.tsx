import React from 'react';
import {
  StandSelectCtrlHoc,
  StandContextHoc,
  defineCommonHocParams,
} from '../StandAdmin/Admin';
import { useStandContext } from '../StandAdmin/Admin/hooks/useStandContext';
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
  ISelectCtrlHocInjectProps,
  IContextHocCommonParams,
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
  getConfig: [],
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
});

function MainComp(
  props: IFormHistroyTriggerProps & ISelectCtrlHocInjectProps<IHistoryRecord>,
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
    extraHocParams?: IContextHocCommonParams;
  } = {},
) => {
  if (!DynamicCompCache[namespace]) {
    const hocWrapper = isListCtrl ? StandSelectCtrlHoc : StandContextHoc;

    DynamicCompCache[namespace] = (hocWrapper as any)({
      ...hocParams,
      makeRecordModelPkgDynamic: namespace,
      ...extraHocParams,
    })(Comp);
  }

  return DynamicCompCache[namespace];
};
