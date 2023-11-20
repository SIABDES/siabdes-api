export type GeneralJournalItem = {
  id: string;
  amount: number;
  is_credit: boolean;
  account_ref: string;
};

export type GeneralJournalDetails = {
  id: string;
  description: string;
  evidence: string;
  occuredAt: Date;
  data_transactions: GeneralJournalItem[];
};
