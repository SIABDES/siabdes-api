import { JournalCategory } from '@prisma/client';
import { JournalItemType } from './journal-item.type';

export type JournalType = {
  id: string;
  category: JournalCategory;
  description: string;
  occured_at: Date;
};

export type JournalDetailsType = JournalType & {
  evidence?: string;
  data_transactions: JournalItemType[];
};
