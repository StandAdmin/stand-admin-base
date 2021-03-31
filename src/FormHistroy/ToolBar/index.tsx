import React from 'react';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useStandContext } from '../../StandAdmin';

import styles from '../styles';

export default (props: any) => {
  const { showEmptyRecordForm } = useStandContext();

  return (
    <div className={styles.toolbar}>
      <Button
        type="primary"
        onClick={showEmptyRecordForm}
        icon={<SaveOutlined />}
      >
        保存当前表单内容
      </Button>
    </div>
  );
};
