import { useContext } from 'react';

import { StandContext } from '../../const';

export function useStandContext() {
  const context = useContext(StandContext);

  return context;
}
