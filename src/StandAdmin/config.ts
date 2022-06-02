import type { TGlobalConfig } from './interface';

const globalConfig: TGlobalConfig = {
  getDvaApp: () => {
    throw new Error('getDvaApp not set in Config');
  },
  getHistory: () => {
    throw new Error('getHistory not set in Config');
  },
  getConnect: () => {
    throw new Error('getConnect not set in Config');
  },
};

export function getConfig() {
  return globalConfig;
}

export function setConfig(config: Partial<TGlobalConfig>) {
  Object.assign(globalConfig, config);
  return globalConfig;
}
