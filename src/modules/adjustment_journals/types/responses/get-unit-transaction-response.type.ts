import { AdjustmentJournalBrief } from '../adjustment-details.type';

export type GetUnitAdjustmentTransactionsResponse = {
  _count: number;
  journals: AdjustmentJournalBrief[];
};
