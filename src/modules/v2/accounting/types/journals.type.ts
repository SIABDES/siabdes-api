import { JournalCategory } from '@prisma/client';
import { JournalV2Type } from '../schemas';

export type JournalDetailsV2Type = JournalV2Type & {
  id: string;
  created_at: Date;
};

export type JournalOverviewV2Type = {
  id: string;
  category: JournalCategory;
  description: string;
  occurred_at: Date;
  created_at: Date;
  updated_at: Date;
};
