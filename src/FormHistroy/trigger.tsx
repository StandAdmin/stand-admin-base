import React from 'react';
import { HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { ITargetFormInfo } from './interface';
import { getDynamicComp, RecordFormWrapper } from './main';
import { useStandContext } from '../StandAdmin/StandRecordsHoc/hooks/useStandContext';
import { isEmpty } from 'lodash';

import styles from './styles';

const SaveTriggerWrapper = (props: any) => {
  const { targetFormInfo } = props;

  const { showEmptyRecordForm } = useStandContext();

  const { form: targetForm } = targetFormInfo as ITargetFormInfo;

  const handleSaveClick = () => {
    if (isEmpty(targetForm.getFieldsValue())) {
      message.warn(`表单内容为空！`);
    }

    showEmptyRecordForm();
  };

  return (
    <RecordFormWrapper
      {...props}
      trigger={() => (
        <Tooltip placement="left" title="保存当前表单内容">
          <div className={styles['vtoolbox-icon']} onClick={handleSaveClick}>
            <SaveOutlined />
          </div>
        </Tooltip>
      )}
    />
  );
};

const modalTrigger = ({ showModal }: any) => (
  <Tooltip placement="left" title="查看历史记录">
    <div className={styles['vtoolbox-icon']}>
      <HistoryOutlined onClick={showModal} />
    </div>
  </Tooltip>
);

export default (props: any) => {
  const { targetFormInfo } = props;

  const { formId, title } = targetFormInfo as ITargetFormInfo;

  const SelectCtrl = getDynamicComp(`${formId}-select-ctrl`);

  const SaveTrigger = getDynamicComp(`${formId}-save-trigger`, {
    isListCtrl: false,
    Comp: SaveTriggerWrapper,
  });

  return (
    <div className={styles.vtoolbox}>
      <SaveTrigger {...props} />
      <SelectCtrl
        specSearchParams={{ formId }}
        modalTrigger={modalTrigger}
        modalProps={{
          width: 700,
          title: `表单历史记录 - ${title}`,
          footer: null,
        }}
        isStandListCtrl={false}
        {...props}
      />
    </div>
  );
};
