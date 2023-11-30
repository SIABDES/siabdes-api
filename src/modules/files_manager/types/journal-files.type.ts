import { JournalCategory } from '@prisma/client';

export type JournalFileInputType = {
  file?: Express.Multer.File;
  unitId: string;
  bumdesId?: string;
  category: JournalCategory;
};
