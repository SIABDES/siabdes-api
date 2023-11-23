import { Decimal } from '@prisma/client/runtime/library';

export type LedgerTransactionDetails = {
  id: string;
  description: string;
  occured_at: Date;
  account_name: string;
  is_credit: boolean;
  amount: Decimal | number;
  calculation_result: number;
};
