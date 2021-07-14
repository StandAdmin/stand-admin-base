import React from 'react';
import {
  ICommonObj,
  ISelectCtrlHocInjectProps,
  IIdSelectCtrlHocProps,
} from '../../interface';
export default function<
  R extends ICommonObj = any,
  P extends ISelectCtrlHocInjectProps<R> = any
>(): (
  WrappedComponent: React.ComponentType<P>,
) => (
  props: Omit<P, keyof ISelectCtrlHocInjectProps<R>> & IIdSelectCtrlHocProps<R>,
) => JSX.Element;
