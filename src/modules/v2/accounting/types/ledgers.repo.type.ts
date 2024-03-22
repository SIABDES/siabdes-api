import { Decimal } from '@prisma/client/runtime/library';
import { GetLedgersV2Dto } from '../dto';

export type LedgersFindAccountResult = {
  id: number;
  isCredit: boolean;
  name: string;
  ref: string;
  groupRef: string;
  subgroupRef: string;
};
export type LedgersFindAccountArgs = {
  account_id: number;
  unit_id: string;
  dto: GetLedgersV2Dto;
};

export type LedgersFindJournalItemsArgs = {
  account_id: number;
  unit_id: string;
  dto: GetLedgersV2Dto;
};
export type LedgersFindJournalItemRow = {
  id: string;
  isCredit: boolean;
  amount: Decimal;
  journal: {
    description: string;
    occurredAt: Date;
  };
};
export type LedgersFindJournalItemsResult = LedgersFindJournalItemRow[];

export type LedgersFindJournalsArgs = {
  account_id: number;
  unit_id: string;
  dto: GetLedgersV2Dto;
};
export type LedgersFindJournalsRowItem = {
  isCredit: boolean;
  amount: Decimal;
};
export type LedgersFindJournalsRow = {
  items: LedgersFindJournalsRowItem[];
};
export type LedgersFindJournalsResult = LedgersFindJournalsRow[];
