export type AdjustmentJournalDetails = {
  id: string;
  description: string;
  occured_at: Date;
  data_transactions: AdjustmentJournalItem[];
};

export type AdjustmentJournalItem = {
  id: string;
  account_ref: string;
  amount: number;
  is_credit: boolean;
};
