import React, { Fragment, useMemo } from 'react';
import { Table } from '../../../UI/lib';
import classNames from 'classnames';
import type {
  PaginationProps,
  TableProps,
  ColumnsType,
} from '../../../UI/interface';
import { useStandContext } from './useStandContext';
import type {
  IStandTableRenderParams,
  IUseStandTableListResult,
  TCommonObj,
  TSearchParams,
  TFnParamsFilter,
} from '../../interface';

import styles from '../styles';

export function calColWidth(
  columns: ColumnsType<any>,
  defaultColWidth: number
) {
  let total = 0;
  columns.forEach((col) => {
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

export interface IPropsForStandTableList<R> {
  isStandAdminHoc: boolean;
  specSearchParams?: TSearchParams | TFnParamsFilter;
  listRowSelectionSupport?: boolean;
  maxCheckedLength?: number;
  isModalMode?: boolean;
}

export interface IStandTableListOpts<R> {
  disabledSearchParams?: string[];
  listRowSelectionSupport?: boolean;
  maxCheckedLength?: number;
  isModalMode?: boolean;
}

export function getOptsForStandTableList<R>(
  props: IPropsForStandTableList<R>
): IStandTableListOpts<R> {
  const {
    listRowSelectionSupport = false,
    maxCheckedLength,
    isModalMode = false,
    specSearchParams,
  } = props;

  const opts = {
    listRowSelectionSupport,
    maxCheckedLength,
    isModalMode,
  };

  if (specSearchParams) {
    const specParamsMap =
      typeof specSearchParams === 'function'
        ? specSearchParams(props)
        : specSearchParams;

    Object.assign(opts, {
      disabledSearchParams: Object.keys(specParamsMap).filter(
        (k) => specParamsMap[k] !== undefined
      ),
    });
  }

  return opts;
}

export function useStandTableList<R extends TCommonObj = any>(
  opts: IStandTableListOpts<R> | IPropsForStandTableList<R>
): IUseStandTableListResult<R> {
  const stOpts: IStandTableListOpts<R> = useMemo(() => {
    return (
      (opts && 'isStandAdminHoc' in opts
        ? getOptsForStandTableList(opts as IPropsForStandTableList<R>)
        : (opts as IStandTableListOpts<R>)) || {}
    );
  }, [opts]);

  const {
    listRowSelectionSupport = false,
    maxCheckedLength,
    isModalMode = false,
  } = stOpts;

  const context = useStandContext<R>();

  const { checkedList = [], setChecked } = context;

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
      (item: R) => !recordsIdMap[getRecordId(item)]
    );

    if (setChecked) {
      // records.filter((item) => selectedRowKeys.indexOf(getRecordId(item)) >= 0)
      setChecked([...rowsNotInRecords, ...selectedRows]);
    }
  };

  const tableListProps: TableProps<R> = {
    dataSource: records,
    bordered: false,
    size: isModalMode && listRowSelectionSupport ? 'small' : undefined,
    rowSelection: listRowSelectionSupport
      ? {
          selectedRowKeys: checkedList.map((item: R) => getRecordId(item)),
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
    config: context.config,
    records,
    showRecordForm,
    loadAndShowRecordForm,
    tableListStyles: styles,
    tableListProps,
    searchLoading,
    standRender: (params: IStandTableRenderParams<R>) => {
      const {
        hasPagination = true,
        noFiltersForDisabledSearchParams = true,
        autoScrollX = false,
        scroll = {},
        columns,
        ...restProps
      } = params;

      // 禁用的搜索项禁用过滤
      if (noFiltersForDisabledSearchParams && stOpts.disabledSearchParams) {
        stOpts.disabledSearchParams.forEach((paramKey) => {
          if (columns) {
            const colItem = columns.find(
              (item: any) => item.dataIndex === paramKey
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

      const { size } = restProps;

      const paginationProps: PaginationProps = {
        size: size === 'small' ? 'small' : undefined,
        ...(typeof hasPagination === 'boolean' ? undefined : hasPagination),
      };

      return (
        <Fragment>
          <Table {...tableListProps} {...restProps} {...{ columns, scroll }} />
          {hasPagination && renderPagination(paginationProps)}
        </Fragment>
      );
    },
  };
}
