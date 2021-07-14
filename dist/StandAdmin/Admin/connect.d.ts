/// <reference types="react" />
import { IContextHocModelParams, IStandConnectInjectProps } from '../interface';
export declare const StandConnectHoc: <
  R = any,
  P extends IStandConnectInjectProps<R> = any
>(
  hocParams: Partial<IContextHocModelParams>,
) => (
  WrappedComponent: import('react').ComponentType<
    Omit<P, keyof IStandConnectInjectProps<R>>
  >,
) => import('react-redux').ConnectedComponent<
  any,
  import('react-redux').Omit<unknown, never>
>;
/** @deprecated use StandConnectHoc instead */
export declare const StandConfigLoadingHoc: <
  R = any,
  P extends IStandConnectInjectProps<R> = any
>(
  hocParams: Partial<IContextHocModelParams>,
) => (
  WrappedComponent: import('react').ComponentType<
    Omit<P, keyof IStandConnectInjectProps<R>>
  >,
) => import('react-redux').ConnectedComponent<
  any,
  import('react-redux').Omit<unknown, never>
>;
