import React from 'react';
import { pullAll, uniqWith, isEqual } from 'lodash';
import { IBatchCheckProps } from '../interface';
// import { Icon } from 'antd';

interface IBatchCheckState<R> {
  checkedList: R[];
}

export interface IRecordMatchOptions<R> {
  getRecordId?: IBatchCheckProps<R>['getRecordId'];
}

export interface IBatchCheckHocParams<R> {
  recordMatch?: (a: R, b: R, options?: IRecordMatchOptions<R>) => boolean;
}

export default function<R = any>(hocParams: IBatchCheckHocParams<R> = {}) {
  const {
    // eslint-disable-next-line func-names
    recordMatch = function(a: R, b: R, options: IRecordMatchOptions<R> = {}) {
      const { getRecordId } = options;

      if (getRecordId) {
        return getRecordId(a) === getRecordId(b);
      }

      return isEqual(a, b);
    },
  } = hocParams;

  return (WrappedComponent: React.ComponentType<any>) =>
    class Comp extends React.Component<
      IBatchCheckProps<R>,
      IBatchCheckState<R>
    > {
      static defaultProps: IBatchCheckProps<R> = {
        defaultCheckedList: [],
        maxCheckedLength: -1,
      };

      state: IBatchCheckState<R> = {
        checkedList: [],
      };

      static getDerivedStateFromProps(
        props: IBatchCheckProps<R>,
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

      constructor(props: IBatchCheckProps<R>) {
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

      isAllChecked = (records: R[]) =>
        !records.some(r => !this.isRecordChecked(r));

      isRecordChecked = (record: R) => {
        const { checkedList } = this.state;
        return checkedList.some(item => this.recordMatch(item, record));
      };

      recordMatch = (r1: R, r2: R) =>
        recordMatch(r1, r2, { getRecordId: this.props.getRecordId });

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

      batchToggleChecked = (records: R[], selected: boolean) => {
        if (selected) {
          this.checkAll(records);
        } else {
          this.uncheckAll(records);
        }
      };

      clearChecked = () => {
        this.setState(this.getNewCheckedState([]));
      };

      checkReverse = (records: R[]) => {
        this.setState(state => {
          const unCheckedList = records.filter(r => !this.isRecordChecked(r));
          const newList = pullAll(state.checkedList, records).concat(
            unCheckedList,
          );
          return this.getNewCheckedState(newList);
        });
      };

      toggleChecked = (record: R, checked: boolean) => {
        this.setState(state => {
          const { checkedList } = state;

          let newCheckedList: R[];

          if (checked) {
            newCheckedList = uniqWith(
              [...checkedList, record],
              this.recordMatch,
            );
          } else {
            newCheckedList = checkedList.filter(
              item => !this.recordMatch(item, record),
            );
          }

          return this.getNewCheckedState(newCheckedList);
        });
      };

      getCheckedList = () => this.state.checkedList;

      render() {
        const { checkedList: propCheckedList, ...restProps } = this.props;

        const { checkedList } = this.state;

        const {
          isAllChecked,
          isRecordChecked,
          setChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          getCheckedList,
          batchToggleChecked,
        } = this;

        const checkedCxt = {
          checkedList,
          setChecked,
          isAllChecked,
          isRecordChecked,
          checkAll,
          uncheckAll,
          checkReverse,
          clearChecked,
          toggleChecked,
          batchToggleChecked,
          getCheckedList,
        };

        return <WrappedComponent {...restProps} {...checkedCxt} />;
      }
    };
}
