import React, { useEffect, useRef, useMemo } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/es/form';
import { identity, isEqual } from 'lodash';
import { usePersistFn } from '@/StandAdmin/utils/hooks';
import { useStandContext } from './useStandContext';
import {
  ICommonObj,
  TCommonObjOrEmpty,
  IUseStandUpsertFormResult,
  IStandContextProps,
  TSearchParams,
  TFnParamsFilter,
  TRenderFormHistroyTriggerOpts,
  IFormHistroyTriggerProps,
} from '../../interface';
import { encodeFormVals, decodeFormVals } from '../../utils/formEncoder';

import FormHistroyTrigger from '../../../FormHistroy/trigger';

export interface IStandUpsertFormOpts<R> {
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
    record: R,
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

export interface IPropsForStandUpsertForm {
  isStandAdminHoc: boolean;
  specParamsAsRecordInitialValues?: boolean;
  recordInitialValues?: ICommonObj;
  specSearchParams?: TSearchParams | TFnParamsFilter;
}

export interface IExtraOpts {
  defaultValues?: IStandUpsertFormOpts<any>['defaultValues'];
}

export function getOptsForStandUpsertForm(
  props: IPropsForStandUpsertForm,
  extraOpts: IExtraOpts = {},
) {
  const { defaultValues = {} } = extraOpts || {};

  const finalDefaultValues = {};

  const {
    specSearchParams,
    specParamsAsRecordInitialValues,
    recordInitialValues,
  } = props;

  if (defaultValues) {
    Object.assign(
      finalDefaultValues,
      typeof defaultValues === 'function'
        ? defaultValues(props)
        : defaultValues,
    );
  }

  if (specParamsAsRecordInitialValues && specSearchParams) {
    Object.assign(
      finalDefaultValues,
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams,
    );
  }

  return {
    defaultValues: {
      ...finalDefaultValues,
      ...recordInitialValues,
    },
  };
}

const isTrue = (v: any) => !!v;

export function useStandUpsertForm<R extends ICommonObj = any>(
  opts: IStandUpsertFormOpts<R> | IPropsForStandUpsertForm,
): IUseStandUpsertFormResult<R> {
  const stOpts: IStandUpsertFormOpts<R> = useMemo(() => {
    return (
      (opts && 'isStandAdminHoc' in opts
        ? getOptsForStandUpsertForm(opts as IPropsForStandUpsertForm)
        : (opts as IStandUpsertFormOpts<R>)) || {}
    );
  }, [opts]);

  const {
    defaultValues,
    recordToValues = identity,
    recordFromValues = identity,
    submitValues,
    onSuccess,
    isModalVisible: origIsModalVisible = isTrue,
  } = stOpts;

  const context: IStandContextProps<R> = useStandContext<R>();

  const {
    StoreNsTitle,
    idFieldName,
    getRecordId,
    getRecordName,
    nameFieldName,
    formNamePrefix,
    storeRef,
    StoreNs,
    addRecord,
    updateRecord,
    mountId,
    config,
  } = context;

  const [form]: [FormInstance] = Form.useForm();

  // if (!form) {
  //   [form] = Form.useForm();
  // }

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

  const activeRecordId = getRecordId(activeRecord);

  const isUpdate = activeRecordId !== undefined && activeRecordId !== null;

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
    if (activeRecord) {
      context.clearActiveRecord();
    }
  });

  const activeRecordName = getRecordName(activeRecord);

  const formId = `${formNamePrefix}_${StoreNs}_Upsert${
    typeof recordFormVisibleTag !== 'boolean' ? '_' + recordFormVisibleTag : ''
  }`;

  const renderFormHistroyTrigger = usePersistFn(
    (renderOpts: TRenderFormHistroyTriggerOpts) => {
      const formHistroyTriggerProps: IFormHistroyTriggerProps = {
        targetFormInfo: { formId, form, title: `${StoreNsTitle}` },
        formValuesEncoder: { encode: encodeFormVals, decode: decodeFormVals },
        historyRecordInfo: { nameFieldName },
      };

      return (
        <FormHistroyTrigger
          {...formHistroyTriggerProps}
          {...(typeof renderOpts === 'function'
            ? renderOpts(formHistroyTriggerProps)
            : renderOpts)}
        />
      );
    },
  );

  return {
    formId,
    renderFormHistroyTrigger,
    formProps: {
      name: `${formId}_${mountId}`,
      form,
      initialValues: getInitValues(activeRecord),
      onFinish,
    },
    modalProps: {
      title: !isUpdate
        ? `创建${StoreNsTitle}`
        : `修改${StoreNsTitle}${
            activeRecordName ? ` - ${activeRecordName}` : ''
          }`,
      visible: isModalVisible(recordFormVisibleTag),
      onOk: submitForm,
      onCancel: handleCancel,
      afterClose: clearActiveRecord,
    },
    /**
     * Normally passed by showRecordForm, and used as match condition in isModalVisible
     */
    recordFormVisibleTag,
    getInitValues,
    getInitValuesByRecord,
    /**
     *  Update or Create
     *  isUpdate =  activeRecord && activeRecord[idFieldName]
     */
    isUpdate,
    activeRecord,
    activeRecordId,
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
