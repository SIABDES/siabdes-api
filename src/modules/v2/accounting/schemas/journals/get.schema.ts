import { JournalCategory } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { IdsWithPaginationSchema } from '~common/schemas';

export const GetManyJournalsV2Schema = IdsWithPaginationSchema.extend({
  category: z.nativeEnum(JournalCategory).optional(),
  is_detailed: z.coerce.boolean().default(false).optional(),
  start_occurred_at: z.dateString().cast().optional(),
  end_occurred_at: z.dateString().cast().optional(),
});

export type GetManyJournalV2Type = z.infer<typeof GetManyJournalsV2Schema>;
