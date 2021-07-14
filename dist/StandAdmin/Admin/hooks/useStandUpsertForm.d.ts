import {
  ICommonObj,
  TCommonObjOrEmpty,
  IUseStandUpsertFormResult,
  IStandContextProps,
  TSearchParams,
  TFnParamsFilter,
  TRecordFormVisibleTag,
  IResponse,
  IStoreRef,
} from '../../interface';
declare function defaultSubmitValues<R extends ICommonObj = any>(
  values: TCommonObjOrEmpty,
  options: {
    config: TCommonObjOrEmpty;
    context: IStandContextProps;
    activeRecord: R;
    isUpdate: boolean;
    addRecord: IStandContextProps<R>['addRecord'];
    updateRecord: IStandContextProps<R>['updateRecord'];
    recordFormVisibleTag: IStoreRef<R>['recordFormVisibleTag'];
  },
): Promise<import('../../interface').IResponseOfAction<R>>;
export interface IStandUpsertFormOpts<R> {
  formIdTag?: string;
  /**
   * 默认的表单数据
   */
  defaultValues?:
    | TCommonObjOrEmpty
    | ((options: { config: TCommonObjOrEmpty }) => TCommonObjOrEmpty);
  /**
   * 接口数据（通常来自于列表接口）转换为表单数据
   */
  recordToValues?: (
    record: R,
    options: {
      config: TCommonObjOrEmpty;
      defaultValues: TCommonObjOrEmpty;
    },
  ) => TCommonObjOrEmpty;
  /**
   * 表单数据转为接口数据（后续会传递给 addRecord/updateRecord）
   */
  recordFromValues?: (
    values: any,
    activeRecord: TCommonObjOrEmpty,
  ) => TCommonObjOrEmpty;
  /**
   * 默认调用 addRecord/updateRecord
   */
  submitValues?: typeof defaultSubmitValues;
  /**
   * submitValues 成功后的回调
   */
  onSuccess?: (resp: IResponse) => void;
  /**
   * 判断 Upsert Modal的显隐, recordFormVisibleTag 来源于 showRecordForm调用传递的参数
   */
  isModalVisible?: (recordFormVisibleTag: TRecordFormVisibleTag) => boolean;
}
export interface IPropsForStandUpsertForm {
  isStandAdminHoc: boolean;
  specParamsAsRecordInitialValues?: boolean;
  recordInitialValues?: ICommonObj;
  specSearchParams?: TSearchParams | TFnParamsFilter;
}
export interface IExtraOpts {
  defaultValues?: IStandUpsertFormOpts<any>['defaultValues'];
}
export declare function getOptsForStandUpsertForm(
  props: IPropsForStandUpsertForm,
  extraOpts?: IExtraOpts,
): {
  defaultValues: {};
};
export declare function useStandUpsertForm<R extends ICommonObj = any>(
  opts: IStandUpsertFormOpts<R> | IPropsForStandUpsertForm,
): IUseStandUpsertFormResult<R>;
export {};
