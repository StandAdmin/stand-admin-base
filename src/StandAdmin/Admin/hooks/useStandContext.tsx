import { useContext } from 'react';
import type { IStandContextProps, TCommonObj } from '../../interface';
import { StandContext } from '../../const';

export function useStandContext<
  R extends TCommonObj = any
>(): IStandContextProps<R> {
  const context: IStandContextProps<R> = useContext(StandContext);
  return context;
}
