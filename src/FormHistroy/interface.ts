import { FormInstance } from 'antd/es/form';

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

export interface ITargetFormInfo {
  formId: string;
  form: FormInstance;
}
