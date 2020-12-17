import React from 'react';

import { IStandContextProps } from './interface';

export const StandContext = React.createContext<IStandContextProps>({} as any);

export const StateParamPrefix = '_zstate_';
