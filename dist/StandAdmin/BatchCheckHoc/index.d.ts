import React from 'react';
import { IBatchCheckHocProps, IBatchCheckHocInjectProps } from '../interface';
interface IBatchCheckState<R> {
  checkedList: R[];
}
interface IBatchCheckOpts<R> {
  recordMatch: (a: R, b: R) => boolean;
}
export default function<R = any, P extends IBatchCheckHocInjectProps<R> = any>(
  opts: IBatchCheckOpts<R>,
): (
  WrappedComponent: React.ComponentType<P>,
) => {
  new (
    props: IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>,
  ): {
    state: IBatchCheckState<R>;
    getNewCheckedState: (
      origList: R[],
    ) => {
      checkedList: R[];
    };
    isAllChecked: (records: R[]) => boolean;
    isChecked: (record: R) => boolean;
    recordMatch: (a: R, b: R) => boolean;
    findMatchRecord: (target: R, list: R[]) => R;
    checkAll: (records: R[]) => void;
    uncheckAll: (records: R[]) => void;
    setChecked: (records: R[]) => void;
    clearChecked: () => void;
    checkReverse: (records: R[]) => void;
    batchToggleChecked: (records: R[], checked: boolean) => void;
    toggleChecked: (record: R | R[], checked: boolean) => void;
    getCheckedList: () => R[];
    render(): JSX.Element;
    context: any;
    setState<K extends 'checkedList'>(
      state:
        | IBatchCheckState<R>
        | ((
            prevState: Readonly<IBatchCheckState<R>>,
            props: Readonly<
              IBatchCheckHocProps<R> &
                Omit<P, keyof IBatchCheckHocInjectProps<R>>
            >,
          ) => IBatchCheckState<R> | Pick<IBatchCheckState<R>, K>)
        | Pick<IBatchCheckState<R>, K>,
      callback?: () => void,
    ): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<
      IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
    > &
      Readonly<{
        children?: React.ReactNode;
      }>;
    refs: {
      [key: string]: React.ReactInstance;
    };
    componentDidMount?(): void;
    shouldComponentUpdate?(
      nextProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      nextState: Readonly<IBatchCheckState<R>>,
      nextContext: any,
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      prevState: Readonly<IBatchCheckState<R>>,
    ): any;
    componentDidUpdate?(
      prevProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      prevState: Readonly<IBatchCheckState<R>>,
      snapshot?: any,
    ): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(
      nextProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      nextContext: any,
    ): void;
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      nextContext: any,
    ): void;
    componentWillUpdate?(
      nextProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      nextState: Readonly<IBatchCheckState<R>>,
      nextContext: any,
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<
        IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>
      >,
      nextState: Readonly<IBatchCheckState<R>>,
      nextContext: any,
    ): void;
  };
  displayName: string;
  defaultProps: IBatchCheckHocProps<R>;
  getDerivedStateFromProps(
    props: IBatchCheckHocProps<R> & Omit<P, keyof IBatchCheckHocInjectProps<R>>,
    state: IBatchCheckState<R>,
  ): {
    checkedList: R[];
  };
  contextType?: React.Context<any>;
};
export {};
