export type LedgerTransactionItem = {
  id: string;
  occurred_at: Date;
  description: string;
  is_credit: boolean;
  amount: number;
  previous_balance: number;
  result_balance: number;
};

export type LedgerAccountInfo = {
  account_id: number;
  account_name: string;
  account_ref: string;
  account_group_ref: string;
  account_subgroup_ref: string;
  account_is_credit: boolean;
};

export type LedgerAccountInfoWithTransactions = LedgerAccountInfo & {
  transaction_count: number;
  result_balance: number;
  transactions: LedgerTransactionItem[];
};
