import React from 'react';
import {
  IContextHocInjectProps,
  IContextHocFullParams,
  TContextHocComponent,
  ICommonObj,
} from '../../interface';
export default function<
  R extends ICommonObj = any,
  P extends IContextHocInjectProps<R> = any
>(
  hocParams: IContextHocFullParams<R>,
): (
  WrappedComponent: React.ComponentType<P>,
) => TContextHocComponent<
  R,
  { [P_1 in Exclude<keyof P, keyof IContextHocInjectProps<R>>]: P[P_1] }
>;
