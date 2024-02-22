import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddUnitCapitalHistorySchema = z.object({
  amount: z
    .number({ required_error: 'Amount must be number' })
    .min(0, 'Amount must be greater than 0'),
  percentage: z
    .number({ required_error: 'Percentage must be number' })
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100'),
  source: z.string().min(1, 'Source must be filled'),
});

export class AddUnitCapitalHistoryDto extends createZodDto(
  AddUnitCapitalHistorySchema,
) {}
