import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddUnitIncomeHistorySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  asset: z.number().min(0),
  revenue: z.number().min(0),
});

export class AddUnitIncomeHistoryDto extends createZodDto(
  AddUnitIncomeHistorySchema,
) {}
