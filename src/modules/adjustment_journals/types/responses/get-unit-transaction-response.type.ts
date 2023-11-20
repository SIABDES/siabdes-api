import { AdjustmentJournalDetails } from '../adjustment-details.type';

export type GetUnitAdjustmentTransactionsResponse = {
  _count: number;
  journals: AdjustmentJournalDetails[];
};
