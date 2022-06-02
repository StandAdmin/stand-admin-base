import React, { useEffect, useMemo } from 'react';

import { Form } from '../../../UI/lib';
import type { FormInstance, FormItemProps } from '../../../UI/interface';
// import moment from 'moment';
// import classNames from 'classnames';
import { identity, isEqual } from 'lodash';
import { usePersistFn } from '../../utils/hooks';
import { encodeFormValues, decodeFormValues } from '../../utils/formEncoder';
import { useStandContext } from './useStandContext';
import FormHistroyTrigger from '../../../FormHistroy/trigger';

import type {
  TCommonObj,
  TSearchParams,
  TRecordOrEmpty,
  IUseStandSearchFormResult,
  TFnParamsFilter,
  TRenderFormHistroyTriggerOpts,
  IFormHistroyTriggerProps,
} from '../../interface';

export interface IStandSearchFormOpts {
  formIdTag?: string;
  defaultSearchParams?: TSearchParams;
  searchParamsToValues?: (params: TSearchParams) => TRecordOrEmpty;
  searchParamsFromValues?: (
    values: TCommonObj,
    searchParams: TSearchParams
  ) => TRecordOrEmpty;
  disabledSearchParams?: string[];
}

export interface IPropsForStandSearchForm {
  isStandAdminHoc: boolean;
  specSearchParams?: TSearchParams | TFnParamsFilter;
}

export function getOptsForStandSearchForm(
  props: IPropsForStandSearchForm
): IStandSearchFormOpts {
  const { specSearchParams } = props;

  const opts = {};

  if (specSearchParams) {
    const specParamsMap =
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams;

    Object.assign(opts, {
      disabledSearchParams: Object.keys(specParamsMap).filter(
        (k) => specParamsMap[k] !== undefined
      ),
    });
  }

  return opts;
}

export function useStandSearchForm<R extends TCommonObj = any>(
  opts: IStandSearchFormOpts | IPropsForStandSearchForm
): IUseStandSearchFormResult<R> {
  const stOpts: IStandSearchFormOpts = useMemo(() => {
    return (
      (opts && 'isStandAdminHoc' in opts
        ? getOptsForStandSearchForm(opts as IPropsForStandSearchForm)
        : (opts as IStandSearchFormOpts)) || {}
    );
  }, [opts]);

  const {
    defaultSearchParams = {},
    searchParamsToValues = identity,
    searchParamsFromValues = identity,
    disabledSearchParams,
    formIdTag = 'Search',
  } = stOpts;

  const context = useStandContext<R>();

  const {
    formNamePrefix,
    storeRef,
    goSearch,
    StoreNs,
    mountId,
    nameFieldName,
    StoreNsTitle,
    getDefaultSearchParams,
    getSpecSearchParams,
    config,
  } = context;

  const [form]: [FormInstance] = Form.useForm();

  const getInitValues = usePersistFn(() =>
    searchParamsToValues({
      ...getDefaultSearchParams(),
      ...defaultSearchParams,
      ...context.getSearchParams(),
      ...storeRef.searchParams,
      ...getSpecSearchParams(),
    })
  );

  useEffect(() => {
    form.setFieldsValue(getInitValues());
  }, [form, getInitValues, storeRef.searchParams]);

  const onFinish = usePersistFn((params: TCommonObj) =>
    goSearch(searchParamsFromValues(params, storeRef.searchParams) as any)
  );

  const submitForm = usePersistFn(() =>
    form.validateFields().then((values) => {
      onFinish(values);
    })
  );

  const resetForm = usePersistFn(() => {
    const values = form.getFieldsValue();

    const emptyValues: TCommonObj = {};

    Object.keys(values).forEach((k) => {
      // const currVal = values[k];
      emptyValues[k] = undefined; // getEmptyVal(currVal);
    });

    const newValues = {
      ...emptyValues,
      ...searchParamsToValues({
        ...getDefaultSearchParams(),
        ...defaultSearchParams,
        ...getSpecSearchParams(),
      }),
    };

    form.setFieldsValue(newValues);

    onFinish(newValues);
  });

  const FormItem = usePersistFn(
    (itemProps: FormItemProps<any>): React.ReactElement => {
      const { children, ...restProps } = itemProps;

      let finalChildren = children;

      const disabled = !!(
        disabledSearchParams &&
        disabledSearchParams.find((disabledName) =>
          isEqual(itemProps.name, disabledName)
        )
      );

      if (disabled) {
        if (React.isValidElement(children)) {
          finalChildren = React.cloneElement(
            children as React.ReactElement<any>,
            { disabled: true }
          );
        } else {
          console.error('Disable will not work', itemProps);
        }
      }

      return <Form.Item {...restProps}>{finalChildren}</Form.Item>;
    }
  );

  const formId = `${formNamePrefix}_${StoreNs}_${formIdTag}`;

  const renderFormHistroyTrigger = usePersistFn(
    (renderOpts: TRenderFormHistroyTriggerOpts) => {
      const formHistroyTriggerProps: IFormHistroyTriggerProps = {
        targetFormInfo: { formId, form, title: `${StoreNsTitle}查询` },
        historyRecordInfo: { nameFieldName },
        formValuesEncoder: {
          encode: encodeFormValues,
          decode: decodeFormValues,
        },
        actionHooks: { afterRestore: submitForm },
      };

      return (
        <FormHistroyTrigger
          {...formHistroyTriggerProps}
          {...(typeof renderOpts === 'function'
            ? renderOpts(formHistroyTriggerProps)
            : renderOpts)}
        />
      );
    }
  );

  return {
    formId,
    renderFormHistroyTrigger: renderFormHistroyTrigger as any,
    formProps: {
      name: `${formId}_${mountId}`,
      form,
      initialValues: getInitValues() as any,
      onFinish,
    },
    config,
    context,
    form,
    onFinish,
    submitForm,
    resetForm,
    FormItem,
  };
}
