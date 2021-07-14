import { IGlobalConfig } from './interface';
export declare function getConfig(): IGlobalConfig;
export declare function setConfig(
  config: Partial<IGlobalConfig>,
): IGlobalConfig;
