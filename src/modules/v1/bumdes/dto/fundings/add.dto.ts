import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddBumdesFundingHistorySchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  rules_number: z.string().min(1),
  village_government_funding: z.object({
    amount: z.number().min(0),
    percentage: z.number().min(0).max(100),
  }),
  other_parties_funding: z.object({
    amount: z.number().min(0),
    percentage: z.number().min(0).max(100),
  }),
});

export class AddBumdesFundingHistoryDto extends createZodDto(
  AddBumdesFundingHistorySchema,
) {}
