export type AdjustmentJournalDetails = AdjustmentJournalBrief & {
  data_transactions: AdjustmentJournalItem[];
};

export type AdjustmentJournalItem = {
  id: string;
  account_ref: string;
  amount: number;
  is_credit: boolean;
};

export type AdjustmentJournalBrief = {
  id: string;
  description: string;
  occured_at: Date;
};
