import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { ITargetFormInfo } from '../interface';
import { encodeFormVals } from '../../StandAdmin/utils/formEncoder';
import {
  useStandUpsertForm,
  getOptsForStandUpsertForm,
} from '../../StandAdmin/StandRecordsHoc/hooks/useStandUpsertForm';

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

export default (props: any) => {
  const { targetFormInfo, historyRecordInfo, formValuesEncoder } = props;

  const { formId, form: targetForm } = targetFormInfo as ITargetFormInfo;

  const { nameFieldName } = historyRecordInfo;

  const getFormVals = () => {
    const { encode = encodeFormVals } = formValuesEncoder || {};
    return encode(targetForm.getFieldsValue());
  };

  const getDefaultName = () => {
    const targetFormVals = getFormVals();

    return nameFieldName in targetFormVals ? targetFormVals[nameFieldName] : '';
  };

  const { context, formProps, modalProps } = useStandUpsertForm({
    ...getOptsForStandUpsertForm(props, {
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
  });

  const { getActionCount } = context;

  const isSubmitting = getActionCount() > 0;

  return (
    <Modal
      // forceRender
      {...modalProps}
      width={580}
      footer={null}
    >
      <Form {...formProps} {...formItemLayout}>
        <FormItem name="name" label="记录名称" rules={[{ required: true }]}>
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
