import React from 'react';
import { Popconfirm } from '../../UI/lib';
import { identity } from 'lodash';
import {
  useStandTableList,
  getOptsForStandTableList,
} from '../../StandAdmin/Admin/hooks/useStandTableList';
import type {
  IFormHistroyTriggerProps,
  IHistoryRecord,
  ITargetFormInfo,
} from '../interface';

import type { ISelectCtrlHocInjectProps } from '../../StandAdmin/interface';

import { decodeFormValues } from '../../StandAdmin/utils/formEncoder';

export default (
  props: IFormHistroyTriggerProps & ISelectCtrlHocInjectProps<IHistoryRecord>
) => {
  const {
    targetFormInfo,
    formValuesEncoder,
    formValuesFilter,
    toggleModalVisible,
    actionHooks,
  } = props;

  const { form: targetForm } = targetFormInfo as ITargetFormInfo;

  const { context, showRecordForm, tableListStyles, standRender } =
    useStandTableList<IHistoryRecord>({
      ...getOptsForStandTableList(props as any),
    });

  const { deleteRecord, idFieldName, getRecordId, getRecordName } = context;

  const recoverRecord = (record: IHistoryRecord) => {
    const { decode = decodeFormValues } = formValuesEncoder || {};

    const { beforeRestore = identity } = formValuesFilter || {};

    const formValues = beforeRestore(decode(record.formVals));

    targetForm.setFieldsValue(formValues);

    const { afterRestore } = actionHooks || {};

    if (afterRestore) {
      afterRestore({ formValues });
    }

    if (toggleModalVisible) {
      toggleModalVisible(false);
    }
  };

  const columns: any = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   fixed: 'left',
    //   width: 80,
    // },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'updateAt',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 170,
      render: (_: any, record: IHistoryRecord) => {
        return (
          <ul className={tableListStyles.actionList}>
            <li style={{ marginRight: 24 }}>
              <a
                onClick={() => {
                  recoverRecord(record);
                }}
              >
                使用
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  showRecordForm(record);
                }}
              >
                编辑
              </a>
            </li>

            <li>
              <Popconfirm
                // tipTitle="删除"
                placement="topRight"
                title={<>确认要删除 [{getRecordName(record)}] ？</>}
                onConfirm={() => {
                  deleteRecord({ [idFieldName]: getRecordId(record) });
                }}
                // onCancel={cancel}
                okText="删除"
                okType="danger"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </li>
          </ul>
        );
      },
    },
  ];

  return standRender({
    autoScrollX: { defaultWidth: 150 },
    columns,
    size: 'small',
  });
};
