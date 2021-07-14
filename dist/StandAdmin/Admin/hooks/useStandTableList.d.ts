import { ColumnsType } from '../../../UI/interface';
import {
  IUseStandTableListResult,
  ICommonObj,
  TSearchParams,
  TFnParamsFilter,
} from '../../interface';
export declare function calColWidth(
  columns: ColumnsType<any>,
  defaultColWidth: number,
): number;
export interface IPropsForStandTableList<R> {
  isStandAdminHoc: boolean;
  specSearchParams?: TSearchParams | TFnParamsFilter;
  listRowSelectionSupport?: boolean;
  maxCheckedLength?: number;
  isModalMode?: boolean;
}
export interface IStandTableListOpts<R> {
  disabledSearchParams?: string[];
  listRowSelectionSupport?: boolean;
  maxCheckedLength?: number;
  isModalMode?: boolean;
}
export declare function getOptsForStandTableList<R>(
  props: IPropsForStandTableList<R>,
): IStandTableListOpts<R>;
export declare function useStandTableList<R extends ICommonObj = any>(
  opts: IStandTableListOpts<R> | IPropsForStandTableList<R>,
): IUseStandTableListResult<R>;
