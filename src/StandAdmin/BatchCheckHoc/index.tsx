import React from 'react';
import { pullAll, uniqWith } from 'lodash';
import { IBatchCheckHocProps, IBatchCheckHocInjectProps } from '../interface';
// import { Icon } from 'antd';
import { getDisplayName } from '../utils/util';

interface IBatchCheckState<R> {
  checkedList: R[];
}

interface IBatchCheckOpts<R> {
  recordMatch: (a: R, b: R) => boolean;
}

export default function<R = any, P extends IBatchCheckHocInjectProps<R> = any>(
  opts: IBatchCheckOpts<R>,
) {
  return (WrappedComponent: React.ComponentType<P>) => {
    type InnerCompProps = IBatchCheckHocProps<R> &
      Omit<P, keyof IBatchCheckHocInjectProps<R>>;
    return class BatchCheck extends React.Component<
      InnerCompProps,
      IBatchCheckState<R>
    > {
      public static displayName = `BatchCheck_${getDisplayName<P>(
        WrappedComponent,
      )}`;

      static defaultProps: IBatchCheckHocProps<R> = {
        defaultCheckedList: [],
        //maxCheckedLength: -1,
      };

      state: IBatchCheckState<R> = {
        checkedList: [],
      };

      static getDerivedStateFromProps(
        props: InnerCompProps,
        state: IBatchCheckState<R>,
      ) {
        if ('checkedList' in props) {
          return {
            ...state,
            checkedList:
              'checkedList' in props
                ? props.checkedList || []
                : state.checkedList,
          };
        }
        return null;
      }

      constructor(props: InnerCompProps) {
        super(props);

        this.state = {
          checkedList:
            ('checkedList' in props
              ? props.checkedList
              : props.defaultCheckedList) || [],
        };
      }

      getNewCheckedState = (origList: R[]) => {
        const { maxCheckedLength = -1, onChange } = this.props;

        let list = origList;

        if (maxCheckedLength > 0) {
          list = list.slice(-1 * maxCheckedLength);
        }

        if (onChange) {
          setTimeout(() => {
            onChange(list);
          }, 0);
        }

        return {
          checkedList: list,
        };
      };

      isAllChecked = (records: R[]) => !records.some(r => !this.isChecked(r));

      isChecked = (record: R) => {
        const { checkedList } = this.state;

        return checkedList.some(item => this.recordMatch(item, record));
      };

      recordMatch = (a: R, b: R) => {
        if (a === b) {
          return true;
        }

        return opts.recordMatch(a, b);
      };

      findMatchRecord = (target: R, list: R[]) =>
        list.find(item => this.recordMatch(item, target));

      checkAll = (records: R[]) => {
        this.setState(state => {
          const newList = uniqWith(
            state.checkedList.concat(records),
            this.recordMatch,
          );

          return this.getNewCheckedState(newList);
        });
      };

      uncheckAll = (records: R[]) => {
        this.setState(state => {
          const newList = state.checkedList.filter(
            record => !this.findMatchRecord(record, records),
          );

          return this.getNewCheckedState(newList);
        });
      };

      setChecked = (records: R[]) => {
        this.setState(() => this.getNewCheckedState(records));
      };

      clearChecked = () => {
        this.setState(this.getNewCheckedState([]));
      };

      checkReverse = (records: R[]) => {
        this.setState(state => {
          const unCheckedList = records.filter(r => !this.isChecked(r));
          const newList = pullAll(state.checkedList, records).concat(
            unCheckedList,
          );
          return this.getNewCheckedState(newList);
        });
      };

      batchToggleChecked = (records: R[], checked: boolean) => {
        return this.toggleChecked(records, checked);
      };

      toggleChecked = (record: R | R[], checked: boolean) => {
        const targets = Array.isArray(record) ? record : [record];

        if (checked) {
          return this.checkAll(targets);
        } else {
          return this.uncheckAll(targets);
        }
      };

      getCheckedList = () => this.state.checkedList;

      render() {
        const {
          checkedList: propCheckedList,
          defaultCheckedList,
          ...restProps
        } = this.props;

        const { checkedList } = this.state;

        const {
          isAllChecked,
          isChecked,
          setChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          getCheckedList,
          batchToggleChecked,
        } = this;

        const hocProps: IBatchCheckHocInjectProps<R> = {
          checkedList,
          setChecked,
          isAllChecked,
          isChecked,
          isRecordChecked: isChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          batchToggleChecked,
          getCheckedList,
        };

        return <WrappedComponent {...(restProps as P)} {...hocProps} />;
      }
    };
  };
}
