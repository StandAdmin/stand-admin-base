import { useEffect, useContext, useRef } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import { identity, isEqual } from 'lodash';
import { usePersistFn } from '@/StandAdmin/utils/hooks';
import { StandContext } from '../../const';
import { ICommonObj, TCommonObjOrEmpty } from '../../interface';

export interface IStandUpsertFormOpts {
  // form?: any;
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
    record: any,
    options: { config: TCommonObjOrEmpty; defaultValues: TCommonObjOrEmpty },
  ) => TCommonObjOrEmpty;

  /**
   * 表单数据转为接口数据（后续会传递给 addRecord/updateRecord）
   */
  recordFromValues?: (
    values: any,
    activeRecord?: TCommonObjOrEmpty,
  ) => TCommonObjOrEmpty;

  /**
   * 默认调用 addRecord/updateRecord
   */
  submitValues?: (values: TCommonObjOrEmpty) => Promise<any>;

  /**
   * submitValues 成功后的回调
   */
  onSuccess?: (resp: ICommonObj) => void;

  /**
   * 判断 Upsert Modal的显隐, recordFormVisibleTag 来源于 showRecordForm调用传递的参数
   */
  isModalVisible?: (recordFormVisibleTag: boolean | string | number) => boolean;
}

export function getOptsForStandUpsertForm(
  props: any,
  {
    defaultValues,
  }: { defaultValues?: IStandUpsertFormOpts['defaultValues'] } = {},
) {
  const config = props.configStoreRef;

  const finalDefaultValues =
    typeof defaultValues === 'function'
      ? defaultValues({ config })
      : defaultValues;

  return {
    defaultValues: {
      ...finalDefaultValues,
      ...(props.specParamsAsRecordInitialValues
        ? props.specSearchParams
        : undefined),
      ...props.recordInitialValues,
    },
  };
}

const isTrue = (v: any) => !!v;

export function useStandUpsertForm({
  // form,
  defaultValues,
  recordToValues = identity,
  recordFromValues = identity,
  submitValues,
  onSuccess,
  isModalVisible: origIsModalVisible = isTrue,
}: IStandUpsertFormOpts = {}) {
  const context = useContext(StandContext);

  const {
    recordNsTitle,
    idFieldName,
    // getRecordId,
    getRecordName,
    nameFieldName,
    formNamePrefix,
    storeRef,
    StoreNs,
    addRecord,
    updateRecord,
    mountId,
  } = context;

  const [form]: [FormInstance] = Form.useForm();

  // if (!form) {
  //   [form] = Form.useForm();
  // }

  const config = context.configStoreRef;

  const { activeRecord, recordFormVisibleTag } = storeRef;

  const refPrevInitValues = useRef(null);

  const getInitValuesByRecord = usePersistFn(specRecord => {
    const finalDefaultValues =
      typeof defaultValues === 'function'
        ? defaultValues({ config })
        : defaultValues;

    return {
      ...finalDefaultValues,
      ...(specRecord
        ? (recordToValues &&
            recordToValues(specRecord, { config, defaultValues })) ||
          specRecord
        : undefined),
    };
  });

  const getInitValues = usePersistFn(specRecord => {
    const initValues = getInitValuesByRecord(specRecord || activeRecord);

    if (isEqual(initValues, refPrevInitValues.current)) {
      return refPrevInitValues.current;
    }

    refPrevInitValues.current = initValues;

    return initValues;
  });

  const isModalVisible = usePersistFn(origIsModalVisible);

  useEffect(() => {
    // form 在modal中时 render会有延迟
    const timeId = setTimeout(() => {
      if (isModalVisible(recordFormVisibleTag)) {
        const values = form.getFieldsValue();

        const emptyValues: ICommonObj = {};

        Object.keys(values).forEach(k => {
          emptyValues[k] = undefined;
        });

        form.setFieldsValue({ ...emptyValues, ...getInitValues(activeRecord) });
      }
    }, 20);

    return () => {
      clearTimeout(timeId);
    };
  }, [isModalVisible, recordFormVisibleTag, activeRecord, form, getInitValues]);

  const isUpdate = activeRecord && activeRecord[idFieldName];

  const defaultSubmitValues = usePersistFn(values => {
    if (isUpdate) {
      return updateRecord({
        [idFieldName]: activeRecord && activeRecord[idFieldName],
        ...values,
      });
    }

    return addRecord(values);
  });

  const resetForm = usePersistFn(() => form.resetFields());

  const onFinish = usePersistFn(values =>
    (submitValues || defaultSubmitValues)(
      recordFromValues(values, activeRecord),
    ).then(resp => {
      if (resp && resp.success) {
        if (!isUpdate) {
          resetForm();
        }

        if (onSuccess) {
          onSuccess(resp);
        }
      }
    }),
  );

  const submitForm = usePersistFn(() =>
    form.validateFields().then(values => {
      onFinish(values);
    }),
  );

  const handleCancel = usePersistFn(() => {
    context.hideRecordFormOnly();
  });

  const clearActiveRecord = usePersistFn(() => {
    context.clearActiveRecord();
  });

  const activeRecordName = getRecordName(activeRecord);

  const formId = `${formNamePrefix}_${StoreNs}_Upsert`;

  return {
    formId,
    formHistroyTriggerProps: {
      targetFormInfo: { formId, form },
      historyRecordInfo: { nameFieldName },
    },
    formProps: {
      name: `${formId}_${mountId}`,
      form,
      initialValues: getInitValues(activeRecord),
      onFinish,
    },
    modalProps: {
      title: !isUpdate
        ? `创建 ${recordNsTitle}`
        : `修改 ${recordNsTitle}${
            activeRecordName ? ` - ${activeRecordName}` : ''
          }`,
      visible: isModalVisible(recordFormVisibleTag),
      onOk: submitForm,
      onCancel: handleCancel,
      afterClose: clearActiveRecord,
    },
    recordFormVisibleTag,
    getInitValues,
    getInitValuesByRecord,
    isUpdate,
    activeRecord,
    context,
    config,
    form,
    onFinish,
    submitForm,
    resetForm,
    handleCancel,
    clearActiveRecord,
  };
}
