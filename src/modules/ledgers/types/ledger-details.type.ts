import { Decimal } from '@prisma/client/runtime/library';

export type LedgerTransactionDetails = {
  id: string;
  occured_at: Date;
  account_ref: string;
  is_credit: boolean;
  amount: Decimal | number;
  calculation_result: number;
};
