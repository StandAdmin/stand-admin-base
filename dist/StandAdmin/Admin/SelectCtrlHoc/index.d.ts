import React from 'react';
import {
  ISelectCtrlHocInjectProps,
  ISelectCtrlHocParams,
  TSelectCtrlHocComponent,
  ICommonObj,
} from '../../interface';
export default function<
  R extends ICommonObj = any,
  P extends ISelectCtrlHocInjectProps<R> = any
>(
  hocParams: ISelectCtrlHocParams<R>,
): (
  WrappedComponent: React.ComponentType<P>,
) => TSelectCtrlHocComponent<
  R,
  { [P_1 in Exclude<keyof P, keyof ISelectCtrlHocInjectProps<R>>]: P[P_1] }
>;
