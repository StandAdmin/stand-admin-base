import React from 'react';
import { Popconfirm } from 'antd';
import { useStandTableList } from '../../StandAdmin';
import { IHistoryRecord, ITargetFormInfo } from '../interface';

export default (props: any) => {
  const { targetFormInfo, toggleModalVisible } = props;

  const { form: targetForm } = targetFormInfo as ITargetFormInfo;

  const {
    context,
    showRecordForm,
    tableListStyles,
    standRender,
  } = useStandTableList(props);

  const { deleteRecord, idFieldName, getRecordId, getRecordName } = context;

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },

    {
      title: '修改时间',
      dataIndex: 'updateAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_: any, record: IHistoryRecord) => {
        return (
          <ul className={tableListStyles.actionList}>
            <li>
              <a
                onClick={() => {
                  targetForm.setFieldsValue(record.formVals);
                  toggleModalVisible(false);
                }}
              >
                还原
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
                title={`确认要删除 [${getRecordName(record)}] ？`}
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

  return standRender({ autoScrollX: { defaultWidth: 150 }, columns });
};
