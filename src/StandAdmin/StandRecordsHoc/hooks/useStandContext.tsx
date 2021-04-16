import { useContext } from 'react';
import { IStandContextProps, ICommonObj } from '../../interface';
import { StandContext } from '../../const';

export function useStandContext<
  R extends ICommonObj = any
>(): IStandContextProps<R> {
  const context: IStandContextProps<R> = useContext(StandContext);
  return context;
}
