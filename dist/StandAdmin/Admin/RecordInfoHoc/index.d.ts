import React from 'react';
import {
  IRecordInfoHocInjectProps,
  IContextHocFullParams,
  TContextHocComponent,
  ICommonObj,
} from '../../interface';
export default function<
  R extends ICommonObj = any,
  P extends IRecordInfoHocInjectProps<R> = any
>(
  hocParams: IContextHocFullParams<R>,
): (WrappedComponent: React.ComponentType<P>) => TContextHocComponent<R, P>;
