import { Decimal } from '@prisma/client/runtime/library';

export type WtbJournalItem = {
  id: string;
  amount: Decimal;
  isCredit: boolean;
  accountId: number;
  isAdjustment: boolean;
};
