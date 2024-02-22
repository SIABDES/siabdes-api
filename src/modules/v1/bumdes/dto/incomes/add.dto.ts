import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddBumdesIncomeHistorySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  omzet: z.number().min(0),
  profit: z.number().min(0),
  dividend: z.number().min(0),
});

export class AddBumdesIncomeHistoryDto extends createZodDto(
  AddBumdesIncomeHistorySchema,
) {}
