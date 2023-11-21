import { LedgerTransactionDetails } from '../ledger-details.type';

export type GetLedgerResponse = {
  _count: number;
  transactions: LedgerTransactionDetails[];
};
