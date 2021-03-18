import React, { useState, useEffect, useMemo } from 'react';
import { useUnmount, usePersistFn } from '@/StandAdmin/utils/hooks';
import { TListCtrlProps } from '.';

import { IListCtrlHocParams, ICommonObj, TKey } from '../../interface';

const TagProp = '_cus_tag_';

export default function<R = any>(hocParams: IListCtrlHocParams<R>) {
  const globalRecordCache: ICommonObj = {};

  return (WrappedComponent: React.ComponentType<any>) => {
    const Comp: React.FC<TListCtrlProps<R> & {
      onChangeWithData?: (list: R[]) => void;
    }> = props => {
      const { getRecordId, idFieldName, nameFieldName } = props;

      const {
        defaultCheckedIdList,
        checkedIdList: origCheckedIdList,
        getRecordMapByIdList,
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

      const tagRecordByIdList = usePersistFn((ids, tag) => {
        updateRecordCache(
          ids.reduce((map: { [key in TKey]: any }, id: TKey) => {
            // eslint-disable-next-line no-param-reassign
            map[id] = tag ? { [TagProp]: tag } : undefined;

            return map;
          }, {}),
        );
      });

      const onChange = usePersistFn(itemList => {
        updateRecordCache(
          itemList.reduce((map: { [key in TKey]: R }, item: R) => {
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
        const getFullRecord = (id: any) => {
          const record = recordCache[id];

          if (record && !record[TagProp]) {
            return record;
          }

          return { [idFieldName]: id, [nameFieldName]: '...' };
        };

        return checkedIdList.map((id: any) => getFullRecord(id));
      }, [checkedIdList, recordCache]);

      return (
        <WrappedComponent
          {...{
            [isControlledMode
              ? 'checkedList'
              : 'defaultCheckedList']: checkedList,
            onChange,
          }}
          {...rest}
        />
      );
    };

    return Comp;
  };
}
