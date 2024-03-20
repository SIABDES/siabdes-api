import { JournalCategory } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { WtbCategoryV2 } from '../../types';
import { CommonPaginationSchema } from '~common/schemas';

export const GetWtbV2Schema = CommonPaginationSchema.extend({
  group_refs: z
    .array(z.string().min(1).max(1))
    .min(1, {
      message: 'group_refs harus memiliki minimal 1 item',
    })
    .optional(),
  retrieval_category: z.nativeEnum(WtbCategoryV2).optional(),
  unit_id: z.string().optional(),
  journal_category: z
    .enum([JournalCategory.GENERAL, JournalCategory.ADJUSTMENT])
    .optional(),
  start_occurred_at: z.dateString().cast().optional(),
  end_occurred_at: z.dateString().cast().optional(),
}).refine((data) => data.group_refs || data.retrieval_category, {
  message: 'group_refs atau retrieval_category harus diisi',
});
