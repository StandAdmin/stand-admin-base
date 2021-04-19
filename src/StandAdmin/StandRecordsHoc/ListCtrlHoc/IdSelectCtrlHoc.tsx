import React, { useState, useEffect, useMemo } from 'react';
import { useUnmount, usePersistFn } from '@/StandAdmin/utils/hooks';
import {
  IListCtrlHocParams,
  ICommonObj,
  TRecordId,
  IListCtrlHocInjectProps,
  IIdSelectCtrlHocProps,
  IStandContextProps,
} from '../../interface';

import { useStandContext } from '../hooks/useStandContext';

const TagProp = '_cus_tag_';

export default function<
  R extends ICommonObj = any,
  P extends IListCtrlHocInjectProps<R> = any
>(hocParams: IListCtrlHocParams<R>) {
  const globalRecordCache: ICommonObj = {};

  return (WrappedComponent: React.ComponentType<P>) => {
    type OuterProps = Omit<P, keyof IListCtrlHocInjectProps<R>> &
      IIdSelectCtrlHocProps<R>;

    const Comp: React.FC<OuterProps> = props => {
      const {
        getRecordId,
        idFieldName,
        nameFieldName,
        getRecordMapByIdList: defaultGetRecordMapByIdList,
      } = useStandContext() as IStandContextProps<R>;

      const {
        defaultCheckedIdList,
        checkedIdList: origCheckedIdList,
        getRecordMapByIdList = defaultGetRecordMapByIdList,
        onChange: origOnChange,
        onChangeWithData,
        ...rest
      } = props;

      const isControlledMode = 'checkedIdList' in props;

      const checkedIdList =
        (isControlledMode ? origCheckedIdList : defaultCheckedIdList) || [];

      const [recordCache, setRecordCache] = useState(globalRecordCache);

      let hasUnMount = false;

      useUnmount(() => {
        hasUnMount = true;
      });

      const updateRecordCache = usePersistFn(newRecordMap => {
        Object.assign(recordCache, newRecordMap);

        Object.assign(globalRecordCache, recordCache);

        if (!hasUnMount) {
          setRecordCache({ ...recordCache });
        }
      });

      const tagRecordByIdList = usePersistFn(
        (ids: TRecordId[], tag: boolean | string) => {
          updateRecordCache(
            ids.reduce((map: { [key in TRecordId]: any }, id: TRecordId) => {
              // eslint-disable-next-line no-param-reassign
              map[id] = tag ? { [TagProp]: tag } : undefined;

              return map;
            }, {}),
          );
        },
      );

      const onChange = usePersistFn((itemList: R[]) => {
        updateRecordCache(
          itemList.reduce((map: { [key in TRecordId]: R }, item: R) => {
            // eslint-disable-next-line no-param-reassign
            map[getRecordId(item)] = item;
            return map;
          }, {}),
        );

        if (onChangeWithData) {
          onChangeWithData(itemList);
        }

        return (
          origOnChange &&
          origOnChange(itemList.map((item: R) => getRecordId(item)))
        );
      });

      useEffect(() => {
        const update = async () => {
          const missingIds = checkedIdList.filter(id => !recordCache[id]);

          if (missingIds.length) {
            tagRecordByIdList(missingIds, 'loading');

            const newRecordMap = await getRecordMapByIdList(missingIds);

            tagRecordByIdList(missingIds, false);

            updateRecordCache(newRecordMap);
          }
        };

        update();
      }, [checkedIdList]);

      const checkedList = useMemo(() => {
        const getFullRecord = (id: TRecordId) => {
          const record = recordCache[id];

          if (record && !record[TagProp]) {
            return record;
          }

          return { [idFieldName]: id, [nameFieldName]: '...' };
        };

        return checkedIdList.map(id => getFullRecord(id));
      }, [checkedIdList, recordCache]);

      return (
        <WrappedComponent
          {...{
            [isControlledMode
              ? 'checkedList'
              : 'defaultCheckedList']: checkedList,
            onChange,
          }}
          {...(rest as P)}
        />
      );
    };

    return Comp;
  };
}
