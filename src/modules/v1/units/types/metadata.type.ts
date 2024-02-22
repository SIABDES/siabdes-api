import { JournalCategory } from '@prisma/client';

export type JournalMetadata = {
  id: string;
  description: string;
  category: JournalCategory;
  occurred_at: Date;
};
