import { useContext } from 'react';
import { IStandContextProps } from '../../interface';
import { StandContext } from '../../const';

export function useStandContext(): IStandContextProps {
  const context = useContext(StandContext);
  return context;
}
