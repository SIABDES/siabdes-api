import { JournalCategory } from '@prisma/client';

export type JournalOverviewV2Type = {
  id: string;
  category: JournalCategory;
  description: string;
  occurred_at: Date;
  created_at: Date;
  updated_at: Date;
};
