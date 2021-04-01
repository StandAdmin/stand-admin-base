import React from 'react';
import { HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ITargetFormInfo } from './interface';
import { getDynamicComp, RecordFormWrapper } from './main';

import styles from './styles';

const SaveTriggerWrapper = (props: any) => {
  return (
    <RecordFormWrapper
      {...props}
      trigger={({ showEmptyRecordForm }: any) => (
        <Tooltip placement="left" title="保存当前表单内容">
          <div
            className={styles['vtoolbox-icon']}
            onClick={showEmptyRecordForm}
          >
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

  const { formId } = targetFormInfo as ITargetFormInfo;

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
          title: '表单历史记录',
          footer: null,
        }}
        isStandListCtrl={false}
        {...props}
      />
    </div>
  );
};
