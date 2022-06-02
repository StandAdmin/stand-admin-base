import Localforage from 'localforage';
import { isMatch, pick } from 'lodash';
import moment from 'moment';

import type { IHistoryRecord, IHistoryRecordSearchParams } from './interface';
const datetimeFormat = 'YYYY-MM-DD HH:mm:ss';

const localforage = Localforage.createInstance({
  name: 'StandAdminFormHistory',
});

const recordMatch = (
  value: IHistoryRecord,
  params: IHistoryRecordSearchParams,
) => {
  return isMatch(value, params);
};

export async function searchRecords(params: IHistoryRecordSearchParams) {
  const list: IHistoryRecord[] = [];

  const matchParams = pick(params, ['id', 'formId', 'name']);

  return localforage
    .iterate((value: IHistoryRecord) => {
      if (recordMatch(value, matchParams)) {
        list.push({ ...value });
      }
    })
    .then(() => {
      list.reverse();
      return {
        success: true,
        data: {
          total: list.length,
          list,
          pageNum: 1,
          pageSize: list.length,
        },
      };
    })
    .catch(err => ({
      success: false,
      message: err,
      data: null,
    }));
}

export async function addRecord(record: IHistoryRecord) {
  return localforage
    .keys()
    .then(keys => {
      keys.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
      return keys[0];
    })
    .then(maxKey => {
      const autoKey = String(parseInt(maxKey || '10000', 10) + 1);

      return localforage
        .setItem(autoKey, {
          ...record,
          id: autoKey,
          updateAt: moment().format(datetimeFormat),
        })
        .then(() => ({
          success: true,
          data: record,
        }));
    })
    .catch(err => ({
      success: false,
      message: err,
      data: record,
    }));
}

export async function updateRecord(record: IHistoryRecord) {
  if (!record.id) {
    throw new Error('id is missing!');
  }

  return localforage
    .setItem(record.id, {
      ...record,
      updateAt: moment().format(datetimeFormat),
    })
    .then(() => ({
      success: true,
      data: record,
    }))
    .catch(err => ({
      success: false,
      message: err,
      data: record,
    }));
}

export async function deleteRecord({ id }: { id: string }) {
  return localforage
    .removeItem(id)
    .then(() => ({
      success: true,
    }))
    .catch(err => ({
      success: false,
      message: err,
    }));
}
