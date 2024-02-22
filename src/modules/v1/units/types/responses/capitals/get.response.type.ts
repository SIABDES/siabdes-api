import { CapitalHistoryItem } from '../../capital-history.type';

export type GetUnitCapitalHistoriesResponse = {
  _count: number;
  histories: CapitalHistoryItem[];
};
