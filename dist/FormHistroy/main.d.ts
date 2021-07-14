import React from 'react';
import { IFormHistroyTriggerProps, IHistoryRecord } from './interface';
import {
  TSelectCtrlHocComponent,
  IContextHocCommonParams,
  IStandContextProps,
} from '../StandAdmin/interface';
export declare const configModel: import('../StandAdmin/interface').IModelPkg<any>;
export declare const recordModel: import('../StandAdmin/interface').IModelPkg<IHistoryRecord>;
export declare function RecordFormWrapper(
  props: IFormHistroyTriggerProps & {
    trigger: (context: IStandContextProps<IHistoryRecord>) => React.ReactNode;
  },
): JSX.Element;
export declare const getDynamicComp: (
  namespace: string,
  {
    Comp,
    extraHocParams,
  }?: {
    Comp?: React.ComponentType<any>;
    extraHocParams?: IContextHocCommonParams;
  },
) => TSelectCtrlHocComponent<any, any>;
