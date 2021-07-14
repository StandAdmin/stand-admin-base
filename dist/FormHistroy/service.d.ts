import { IHistoryRecord, IHistoryRecordSearchParams } from './interface';
export declare function searchRecords(
  params: IHistoryRecordSearchParams,
): Promise<
  | {
      success: boolean;
      data: {
        total: number;
        list: IHistoryRecord[];
        pageNum: number;
        pageSize: number;
      };
    }
  | {
      success: boolean;
      message: any;
      data: any;
    }
>;
export declare function addRecord(
  record: IHistoryRecord,
): Promise<
  | {
      success: boolean;
      data: IHistoryRecord;
    }
  | {
      success: boolean;
      message: any;
      data: IHistoryRecord;
    }
>;
export declare function updateRecord(
  record: IHistoryRecord,
): Promise<
  | {
      success: boolean;
      data: IHistoryRecord;
    }
  | {
      success: boolean;
      message: any;
      data: IHistoryRecord;
    }
>;
export declare function deleteRecord({
  id,
}: {
  id: string;
}): Promise<
  | {
      success: boolean;
    }
  | {
      success: boolean;
      message: any;
    }
>;
