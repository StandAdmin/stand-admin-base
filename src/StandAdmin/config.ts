import { IGlobalConfig } from './interface';

const globalConfig: IGlobalConfig = {};

export function getConfig() {
  return globalConfig;
}

export function setConfig(config: IGlobalConfig) {
  Object.assign(globalConfig, config);
}
