import React from 'react';

import { IStandContextProps } from './interface';

export const StandContext = React.createContext<IStandContextProps>({} as any);

export const ConfigLoadingMethod = 'loadConfig';

export const StateParamPrefix = '_zstate_';

export const ConfigLoadingFld = '_stdadm_config_loading_';

export const ModelNsPre = '_StdAdmMod_';
