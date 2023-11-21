export type GeneralJournalItem = {
  id: string;
  amount: number;
  is_credit: boolean;
  account_ref: string;
  account_id: number;
};

export type GeneralJournalDetails = GeneralJournalBrief & {
  data_transactions: GeneralJournalItem[];
};

export type GeneralJournalBrief = {
  id: string;
  description: string;
  evidence: string;
  occuredAt: Date;
};
