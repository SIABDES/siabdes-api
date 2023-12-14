import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UpdateUnitProfitHistorySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  profit: z.number().min(0),
  dividend: z.number().min(0),
});

export class UpdateUnitProfitHistoryDto extends createZodDto(
  UpdateUnitProfitHistorySchema,
) {}
