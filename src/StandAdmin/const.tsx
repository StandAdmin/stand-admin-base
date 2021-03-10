import React from 'react';

import { IStandContextProps } from './interface';

export const StandContext = React.createContext<IStandContextProps>({} as any);

export const StateParamPrefix = '_zstate_';

export const ConfigLoadingFld = '_config_loading_';

export const ConfigLoadingMethod = 'loadConfig';
