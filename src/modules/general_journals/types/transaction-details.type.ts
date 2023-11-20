export type GeneralJournalItem = {
  id: string;
  amount: number;
  is_credit: boolean;
  account_ref: string;
};

export type GeneralJournalDetails = {
  description: string;
  occuredAt: Date;
  data_transactions: GeneralJournalItem[];
};
