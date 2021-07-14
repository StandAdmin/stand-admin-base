import React from 'react';
import { IActionCounterHocInjectProps } from '../interface';
interface IActionCounterState {
  counterMap: {
    [key: string]: number;
  };
}
export default function<P extends IActionCounterHocInjectProps = any>(): (
  WrappedComponent: React.ComponentType<P>,
) => {
  new (
    props:
      | {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      | Readonly<
          {
            [P_1 in Exclude<
              keyof P,
              keyof IActionCounterHocInjectProps
            >]: P[P_1];
          }
        >,
  ): {
    state: IActionCounterState;
    increaseActionCount: (action?: string, num?: number) => void;
    decreaseActionCount: (action?: string, num?: number) => void;
    getActionCount: (action?: string | string[]) => number;
    render(): JSX.Element;
    context: any;
    setState<K extends 'counterMap'>(
      state:
        | IActionCounterState
        | ((
            prevState: Readonly<IActionCounterState>,
            props: Readonly<
              {
                [P_1 in Exclude<
                  keyof P,
                  keyof IActionCounterHocInjectProps
                >]: P[P_1];
              }
            >,
          ) => IActionCounterState | Pick<IActionCounterState, K>)
        | Pick<IActionCounterState, K>,
      callback?: () => void,
    ): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<
      { [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1] }
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
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      prevState: Readonly<IActionCounterState>,
    ): any;
    componentDidUpdate?(
      prevProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      prevState: Readonly<IActionCounterState>,
      snapshot?: any,
    ): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextContext: any,
    ): void;
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextContext: any,
    ): void;
    componentWillUpdate?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): void;
  };
  new (
    props: {
      [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
    },
    context: any,
  ): {
    state: IActionCounterState;
    increaseActionCount: (action?: string, num?: number) => void;
    decreaseActionCount: (action?: string, num?: number) => void;
    getActionCount: (action?: string | string[]) => number;
    render(): JSX.Element;
    context: any;
    setState<K extends 'counterMap'>(
      state:
        | IActionCounterState
        | ((
            prevState: Readonly<IActionCounterState>,
            props: Readonly<
              {
                [P_1 in Exclude<
                  keyof P,
                  keyof IActionCounterHocInjectProps
                >]: P[P_1];
              }
            >,
          ) => IActionCounterState | Pick<IActionCounterState, K>)
        | Pick<IActionCounterState, K>,
      callback?: () => void,
    ): void;
    forceUpdate(callback?: () => void): void;
    readonly props: Readonly<
      { [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1] }
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
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      prevState: Readonly<IActionCounterState>,
    ): any;
    componentDidUpdate?(
      prevProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      prevState: Readonly<IActionCounterState>,
      snapshot?: any,
    ): void;
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextContext: any,
    ): void;
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextContext: any,
    ): void;
    componentWillUpdate?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<
        {
          [P_1 in Exclude<keyof P, keyof IActionCounterHocInjectProps>]: P[P_1];
        }
      >,
      nextState: Readonly<IActionCounterState>,
      nextContext: any,
    ): void;
  };
  displayName: string;
  contextType?: React.Context<any>;
};
export {};
