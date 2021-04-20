import React from 'react';
import { HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import { ITargetFormInfo, IHistoryRecord } from './interface';
import { IFormHistroyTriggerProps } from '../StandAdmin/interface';
import { getDynamicComp, RecordFormWrapper } from './main';
import { useStandContext } from '../StandAdmin/StandRecordsHoc/hooks/useStandContext';
import { isEmpty } from 'lodash';

import styles from './styles';

const SaveTriggerWrapper = (props: IFormHistroyTriggerProps) => {
  const { targetFormInfo } = props;

  const { showEmptyRecordForm } = useStandContext<IHistoryRecord>();

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
        <Tooltip placement="left" title="暂存表单为草稿">
          <div className={styles['vtoolbox-icon']} onClick={handleSaveClick}>
            <SaveOutlined />
          </div>
        </Tooltip>
      )}
    />
  );
};

const modalTrigger = ({ showModal }: any) => (
  <Tooltip placement="left" title="查看草稿记录">
    <div className={styles['vtoolbox-icon']} onClick={showModal}>
      <HistoryOutlined />
    </div>
  </Tooltip>
);

export default (props: IFormHistroyTriggerProps) => {
  const { targetFormInfo } = props;

  const { formId, title } = targetFormInfo as ITargetFormInfo;

  const SelectCtrl = getDynamicComp(`${formId}-select-ctrl`);

  const SaveTrigger = getDynamicComp(`${formId}-save-trigger`, {
    isListCtrl: false,
    Comp: SaveTriggerWrapper,
    extraHocParams: { searchRecordsOnMount: false },
  });

  return (
    <div className={styles.vtoolbox}>
      <SaveTrigger {...props} />
      <SelectCtrl
        specSearchParams={{ formId }}
        modalTrigger={modalTrigger}
        modalProps={{
          width: 700,
          title: `表单草稿记录 - ${title}`,
          footer: null,
        }}
        isStandListCtrl={false}
        {...props}
      />
    </div>
  );
};
