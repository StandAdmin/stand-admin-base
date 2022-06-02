export {
  ITargetFormInfo,
  IFormHistroyTriggerProps,
} from '../StandAdmin/interface';
export type FormValues = Record<string, any>;

export interface IHistoryRecord {
  id?: string;
  name: string;
  formId: string;
  formVals: FormValues;
  updateAt?: string;
}

export interface IHistoryRecordSearchParams {
  id?: string;
  name?: string;
  formId?: string;
}
