import React from 'react';
import { HistoryOutlined, SaveOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import classNames from 'classnames';
import { ITargetFormInfo, IHistoryRecord } from './interface';
import { IFormHistroyTriggerProps } from '../StandAdmin/interface';
import { getDynamicComp, RecordFormWrapper } from './main';
import { useStandContext } from '../StandAdmin/Admin/hooks/useStandContext';
import { isEmpty } from 'lodash';

import styles from './styles';

const defaultHistorySaveTrigger: IFormHistroyTriggerProps['historySaveTrigger'] = ({
  showSaveForm,
}) => (
  <Tooltip placement="left" title="暂存表单为草稿">
    <div className={styles['vtoolbox-icon']} onClick={showSaveForm}>
      <SaveOutlined />
    </div>
  </Tooltip>
);

const defaultHistoryListTrigger: IFormHistroyTriggerProps['historyListTrigger'] = ({
  showListModal,
}) => (
  <Tooltip placement="left" title="查看草稿记录">
    <div className={styles['vtoolbox-icon']} onClick={showListModal}>
      <HistoryOutlined />
    </div>
  </Tooltip>
);

const SaveTriggerWrapper = (props: IFormHistroyTriggerProps) => {
  const {
    targetFormInfo,
    historySaveTrigger = defaultHistorySaveTrigger,
  } = props;

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
      trigger={() => {
        return historySaveTrigger({ showSaveForm: handleSaveClick });
      }}
    />
  );
};

export default (props: IFormHistroyTriggerProps) => {
  const { wrapperClassName, ...restProps } = props;

  const {
    targetFormInfo,
    historyListTrigger = defaultHistoryListTrigger,
  } = restProps;

  const { formId, title } = targetFormInfo as ITargetFormInfo;

  const SelectCtrl = getDynamicComp(`${formId}-select-ctrl`);

  const SaveTrigger = getDynamicComp(`${formId}-save-trigger`, {
    Comp: SaveTriggerWrapper,
    extraHocParams: { searchRecordsOnMount: false },
  });

  return (
    <div className={classNames(styles.vtoolbox, wrapperClassName)}>
      <SaveTrigger isModalMode={false} {...restProps} />
      <SelectCtrl
        specSearchParams={{ formId }}
        modalTrigger={opts => {
          return historyListTrigger({ showListModal: opts.showModal });
        }}
        modalProps={{
          width: 700,
          title: `表单草稿记录 - ${title}`,
          footer: null,
        }}
        listRowSelectionSupport={false}
        {...restProps}
      />
    </div>
  );
};
