import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UpdateUnitCapitalHistorySchema = z.object({
  amount: z.number().min(0),
  percentage: z.number().min(0).max(100),
  source: z.string().min(1),
});

export class UpdateUnitCapitalHistoryDto extends createZodDto(
  UpdateUnitCapitalHistorySchema,
) {}
