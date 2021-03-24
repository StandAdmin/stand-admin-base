import React, { Fragment, useContext, useMemo } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { TableProps, ColumnsType } from 'antd/es/table';
import { StandContext } from '../../const';
import { TListCtrlProps } from '../../interface';

import styles from '../styles';

export interface StandRenderParams extends TableProps<any> {
  hasPagination?: boolean;
  noFiltersForDisabledSearchParams?: boolean;
  autoScrollX?: boolean | { defaultWidth?: number; extraWidth?: number };
}

export interface IStandTableListOpts {
  disabledSearchParams?: string[];
}

export function getOptsForStandTableList(props: any): IStandTableListOpts {
  return {
    disabledSearchParams: props.specSearchParams
      ? Object.keys(props.specSearchParams).filter(
          k => props.specSearchParams[k] !== undefined,
        )
      : null,
  };
}

export function calColWidth(
  columns: ColumnsType<any>,
  defaultColWidth: number,
) {
  let total = 0;
  columns.forEach(col => {
    if (col.width) {
      if (typeof col.width === 'number') {
        total += col.width;
      }
    } else if ('children' in col) {
      if (col.children) {
        total += calColWidth(col.children, defaultColWidth);
      }
    } else {
      total += defaultColWidth;
    }
  });

  return total;
}

export function useStandTableList(props: TListCtrlProps<any>) {
  const stateOpts = useMemo(() => getOptsForStandTableList(props), [props]);

  const { isStandListCtrl, checkedList, maxCheckedLength, isModalMode } = props;

  const context = useContext(StandContext);

  const {
    renderPagination,
    showRecordForm,
    loadAndShowRecordForm,
    storeRef,
    getRecordId,
    idFieldName,
    searchLoading,
    handleTableChange,
  } = context;

  const { records, activeRecord, blinkRecord, removingRecord } = storeRef;

  const onSelectChange = (selectedRowKeys: any[], selectedRows: any[]) => {
    const recordsIdMap = records.reduce((map: any, item: any) => {
      // eslint-disable-next-line no-param-reassign
      map[getRecordId(item)] = item;
      return map;
    }, {});

    const rowsNotInRecords = checkedList.filter(
      (item: any) => !recordsIdMap[getRecordId(item)],
    );

    // records.filter((item) => selectedRowKeys.indexOf(getRecordId(item)) >= 0)
    props.setChecked([...rowsNotInRecords, ...selectedRows]);
  };

  const tableListProps: TableProps<any> = {
    dataSource: records,
    bordered: false,
    size: isModalMode && isStandListCtrl ? 'small' : undefined,
    rowSelection: isStandListCtrl
      ? {
          selectedRowKeys: checkedList.map((item: any) => getRecordId(item)),
          onChange: onSelectChange,
          type: maxCheckedLength === 1 ? 'radio' : 'checkbox',
        }
      : undefined,
    className: styles.table,
    onRow: (record: any) => ({
      className: classNames(styles.record, {
        [styles.activeRecord]: record === activeRecord,
        [styles.blinkRecord]: record === blinkRecord,
        [styles.removingRecord]: record === removingRecord,
      }),
    }),
    rowKey: idFieldName,
    loading: searchLoading,
    pagination: false,
    onChange: handleTableChange,
  };

  return {
    context,
    config: context.configStoreRef,
    records,
    showRecordForm,
    loadAndShowRecordForm,
    tableListStyles: styles,
    tableListProps,
    searchLoading,
    standRender: (extraProps: StandRenderParams) => {
      const {
        hasPagination = true,
        noFiltersForDisabledSearchParams = true,
        autoScrollX = false,
        scroll = {},
        columns,
        ...restProps
      } = extraProps;

      // 禁用的搜索项禁用过滤
      if (noFiltersForDisabledSearchParams && stateOpts.disabledSearchParams) {
        stateOpts.disabledSearchParams.forEach(paramKey => {
          if (columns) {
            const colItem = columns.find(
              (item: any) => item.dataIndex === paramKey,
            );
            if (colItem) {
              if (colItem.filters) {
                delete colItem.filters;
              }
            }
          }
        });
      }

      if (autoScrollX) {
        const { defaultWidth = 200, extraWidth = 0 } =
          typeof autoScrollX === 'object' ? autoScrollX : {};

        if (columns) {
          Object.assign(scroll, {
            x: calColWidth(columns, defaultWidth) + extraWidth,
          });
        }
      }

      return (
        <Fragment>
          <Table {...tableListProps} {...restProps} {...{ columns, scroll }} />
          {hasPagination && renderPagination()}
        </Fragment>
      );
    },
  };
}
