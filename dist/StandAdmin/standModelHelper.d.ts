import {
  IResponse,
  IStandModelOptions,
  IStandConfigModelOptions,
  IModelPkg,
  TFldsPathInRespMapValue,
  DvaModel,
} from './interface';
export declare function handleCommonRespError(
  requestTitle: string,
  response: IResponse | null,
  {
    errorTitle,
    errorMsgFields,
    permissionApplyUrlFields,
  }?: {
    errorTitle?: string;
    errorMsgFields?: TFldsPathInRespMapValue;
    permissionApplyUrlFields?: TFldsPathInRespMapValue;
  },
): void;
export declare function getStandModel<R = any>(
  opts: IStandModelOptions<R>,
): DvaModel;
export declare function getStandConfigModel(
  opts: IStandConfigModelOptions,
): DvaModel;
export declare function getAutoStoreNs(key: string): string;
export declare function buildStandRecordModelPkg<R = any>(
  opts?: IStandModelOptions<R>,
): IModelPkg<R>;
export declare function cloneModelPkg<R>(
  modelPkg: IModelPkg,
  nsTag?: string,
  opts?: Omit<IStandModelOptions<R>, 'StoreNs'>,
): IModelPkg<R>;
export declare function getDynamicModelPkg(
  modelPkg: IModelPkg,
  nsTag?: string,
): IModelPkg<unknown>;
export declare function buildStandConfigModelPkg(
  opts: IStandConfigModelOptions,
): IModelPkg;
export declare const EmptyConfigModel: IModelPkg<any>;
export declare const EmptyRecordModel: IModelPkg<any>;
