import { UnitProfitHistoryItem } from '../..';

export type GetUnitProfitHistoriesResponse = {
  _count: number;
  histories: UnitProfitHistoryItem[];
};
