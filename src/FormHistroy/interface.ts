export {
  ITargetFormInfo,
  IFormHistroyTriggerProps,
} from '../StandAdmin/interface';
export interface FormValues {
  [key: string]: any;
}

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
