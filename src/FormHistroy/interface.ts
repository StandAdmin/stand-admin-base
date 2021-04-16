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
  title: string;
}

export interface IFormHistroyTriggerProps {
  targetFormInfo: ITargetFormInfo;
  formValuesEncoder: { encode: (vals: any) => any; decode: (vals: any) => any };
  historyRecordInfo: { nameFieldName: string };
  actionHooks: { afterRestore: (vals: any) => any };

  toggleModalVisible?: (v: boolean) => void;
}
