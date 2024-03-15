import { PaginationResponse } from '~common/responses';
import { LedgerAccountInfo, LedgerTransactionItem } from '../types';

export type GetLedgersV2Response = PaginationResponse & {
  last_balance: number;
  result_balance: number;
  _count: number;
  transactions: LedgerTransactionItem[];
};

export type GetLedgersFinalBalanceV2Response = LedgerAccountInfo & {
  start_occurred_at: Date;
  end_occurred_at: Date;
  journals_count: number;
  items_count: number;
  final_balance: number;
};
