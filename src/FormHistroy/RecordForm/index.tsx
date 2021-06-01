import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { cloneDeepWith } from 'lodash';
import {
  ITargetFormInfo,
  IFormHistroyTriggerProps,
  IHistoryRecord,
} from '../interface';
import { encodeFormValues } from '../../StandAdmin/utils/formEncoder';
import {
  useStandUpsertForm,
  getOptsForStandUpsertForm,
} from '../../StandAdmin/Admin/hooks/useStandUpsertForm';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function strLen(str: string) {
  var count = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    count += str.charCodeAt(i) < 256 ? 1 : 2;
  }
  return count;
}

const getStrValPrioriy = (a: any) => {
  switch (typeof a) {
    case 'string':
      return strLen(a);

    case 'number':
      return 1;

    default:
      return 0;
  }
};

const findValidName = (targetVals: any) => {
  const strVals: (string | number)[] = [];

  // 深度遍历
  cloneDeepWith(targetVals, function(val) {
    if (typeof val === 'string' || typeof val === 'number') {
      strVals.push(val);
    }
  });

  if (strVals.length) {
    strVals.sort((a, b) => {
      return getStrValPrioriy(b) - getStrValPrioriy(a);
    });

    return strVals[0];
  }

  return null;
};

export default (props: IFormHistroyTriggerProps) => {
  const { targetFormInfo, historyRecordInfo, formValuesEncoder } = props;

  const { formId, form: targetForm } = targetFormInfo as ITargetFormInfo;

  const { nameFieldName } = historyRecordInfo;

  const getFormVals = () => {
    const { encode = encodeFormValues } = formValuesEncoder || {};
    return encode(targetForm.getFieldsValue());
  };

  const getDefaultName = () => {
    const targetFormVals = getFormVals();

    let name = targetFormVals[nameFieldName];

    if (!name) {
      name = findValidName(targetFormVals);
    }

    return name || '';
  };

  const { context, formProps, modalProps } = useStandUpsertForm<IHistoryRecord>(
    {
      ...getOptsForStandUpsertForm(props as any, {
        // 默认值
        defaultValues: {
          name: getDefaultName(),
        },
      }),
      // 接口数据（通常来自于列表接口）转换为表单数据
      recordToValues: record => ({
        ...record,
      }),
      // 表单数据转为接口数据（后续会传递给 addRecord/updateRecord）
      recordFromValues: values => {
        const { name } = values;

        return {
          name,
          formId,
          formVals: getFormVals(),
        };
      },
    },
  );

  const { getActionCount } = context;

  const isSubmitting = getActionCount() > 0;

  return (
    <Modal
      // forceRender
      {...modalProps}
      // title={`${modalProps.title} - ${title}`}
      width={580}
      footer={null}
    >
      <Form {...formProps} {...formItemLayout}>
        <FormItem name="name" label="草稿名称" rules={[{ required: true }]}>
          <Input allowClear />
        </FormItem>

        <FormItem
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 6 },
          }}
        >
          <Button
            style={{ width: 150, display: 'block' }}
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            保存
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};
