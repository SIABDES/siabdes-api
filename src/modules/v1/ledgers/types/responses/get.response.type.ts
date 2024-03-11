import { PaginationResponse } from '~common/responses';
import { LedgerTransactionDetails } from '../ledger-details.type';

export type GetLedgerResponse = PaginationResponse & {
  account_name: string;
  account_ref: string;
  result_balance: number;
  account_is_credit: boolean;
  _count: number;
  transactions: LedgerTransactionDetails[];
};
