import React, { useEffect, useContext, useMemo } from 'react';

import { Form } from 'antd';
import { FormInstance } from 'antd/es/form';
// import moment from 'moment';
// import classNames from 'classnames';
import { identity } from 'lodash';
import { usePersistFn } from '@/StandAdmin/utils/hooks';

import { StandContext } from '../../const';

import {
  ICommonObj,
  TCommonObjOrEmpty,
  IStandContextProps,
} from '../../interface';

export interface IStandSearchFormOpts {
  defaultSearchParams?: ICommonObj;
  searchParamsToValues?: (params: ICommonObj) => TCommonObjOrEmpty;
  searchParamsFromValues?: (
    values: ICommonObj,
    searchParams?: TCommonObjOrEmpty,
  ) => TCommonObjOrEmpty;
  disabledSearchParams?: string[];
}

// function getEmptyVal(val: any) {
//   switch (typeof val) {
//     case 'string':
//     case 'number':
//       return undefined;

//     case 'object':
//       if (moment.isMoment(val)) {
//         return undefined;
//       }
//       return Array.isArray(val) ? [] : {};

//     default:
//       return undefined;
//   }
// }

export function getOptsForStandSearchForm(props: any): IStandSearchFormOpts {
  return {
    disabledSearchParams: props.specSearchParams
      ? Object.keys(props.specSearchParams).filter(
          k => props.specSearchParams[k] !== undefined,
        )
      : null,
  };
}

export function useStandSearchForm(
  props: IStandSearchFormOpts | IStandContextProps,
) {
  const stateOpts = useMemo(() => {
    return 'debouncedSearchRecords' in props
      ? getOptsForStandSearchForm(props)
      : props;
  }, [props]);

  const {
    defaultSearchParams = {},
    searchParamsToValues = identity,
    searchParamsFromValues = identity,
    disabledSearchParams,
  } = stateOpts;

  const context = useContext(StandContext);

  const {
    formNamePrefix,
    storeRef,
    goSearch,
    StoreNs,
    mountId,
    getDefaultSearchParams,
    getSpecSearchParams,
  } = context;

  const [form]: [FormInstance] = Form.useForm();

  const getInitValues = usePersistFn(() =>
    searchParamsToValues({
      ...getDefaultSearchParams(),
      ...defaultSearchParams,
      ...storeRef.searchParams,
      ...getSpecSearchParams(),
    }),
  );

  useEffect(() => {
    form.setFieldsValue(getInitValues());
  }, [form, getInitValues, storeRef.searchParams]);

  const onFinish = usePersistFn((params: ICommonObj) =>
    goSearch(searchParamsFromValues(params, storeRef.searchParams)),
  );

  const submitForm = usePersistFn(() =>
    form.validateFields().then(values => {
      onFinish(values);
    }),
  );

  const resetForm = usePersistFn(() => {
    const values = form.getFieldsValue();

    const emptyValues: ICommonObj = {};

    Object.keys(values).forEach(k => {
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

  const FormItem = usePersistFn(itemProps => {
    const { children, ...restProps } = itemProps;

    let finalChildren = children;

    const disabled =
      disabledSearchParams && disabledSearchParams.indexOf(itemProps.name) >= 0;

    if (disabled) {
      if (React.isValidElement(children)) {
        finalChildren = React.cloneElement(
          children as React.ReactElement<any>,
          { disabled: true },
        );
      } else {
        console.error('Disable will not work', itemProps);
      }
    }

    return <Form.Item {...restProps}>{finalChildren}</Form.Item>;
  });

  return {
    formProps: {
      name: `${formNamePrefix}_${StoreNs}_${mountId}_Search`,
      form,
      initialValues: getInitValues(),
      onFinish,
    },
    config: context.configStoreRef,
    context,
    form,
    onFinish,
    submitForm,
    resetForm,
    FormItem,
  };
}
