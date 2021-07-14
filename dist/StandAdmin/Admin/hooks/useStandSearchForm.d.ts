import {
  ICommonObj,
  TSearchParams,
  TCommonObjOrEmpty,
  IUseStandSearchFormResult,
  TFnParamsFilter,
} from '../../interface';
export interface IStandSearchFormOpts {
  formIdTag?: string;
  defaultSearchParams?: TSearchParams;
  searchParamsToValues?: (params: TSearchParams) => TCommonObjOrEmpty;
  searchParamsFromValues?: (
    values: ICommonObj,
    searchParams: TSearchParams,
  ) => TCommonObjOrEmpty;
  disabledSearchParams?: string[];
}
export interface IPropsForStandSearchForm {
  isStandAdminHoc: boolean;
  specSearchParams?: TSearchParams | TFnParamsFilter;
}
export declare function getOptsForStandSearchForm(
  props: IPropsForStandSearchForm,
): IStandSearchFormOpts;
export declare function useStandSearchForm<R extends ICommonObj = any>(
  opts: IStandSearchFormOpts | IPropsForStandSearchForm,
): IUseStandSearchFormResult<R>;
