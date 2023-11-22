import { PaginationResponse } from '~common/types/responses';
import { LedgerTransactionDetails } from '../ledger-details.type';

export type GetLedgerResponse = PaginationResponse & {
  _count: number;
  transactions: LedgerTransactionDetails[];
};
