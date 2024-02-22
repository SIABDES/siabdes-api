import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UpdateBumdesProfileSchema = z.object({
  name: z.string().min(1),
  founded_at: z.dateString().maxYear(new Date().getFullYear()),
  phone: z.string().min(1),
  complete_address: z.string().min(1),

  village_rule_number: z.string().min(1),
  sk_administrator_number: z.string().min(1),
  sk_administrator_date: z.dateString(),
  sk_assistant_number: z.string().min(1),
  sk_assistant_date: z.dateString(),

  bank: z
    .object({
      name: z.string().min(1),
      account_number: z.string().min(1),
    })
    .optional(),

  npwp_number: z.string().min(15).max(16).optional(),

  socials: z
    .object({
      facebook: z.string().url().min(1).optional(),
      twitter: z.string().url().min(1).optional(),
      instagram: z.string().url().min(1).optional(),
      website: z.string().url().min(1).optional(),
      other_socials: z.string().min(1).optional(),
    })
    .optional(),

  capital_participation: z.object({
    initial: z.number().min(0),
    additional: z.number().min(0),
  }),
});

export class UpdateBumdesProfileDto extends createZodDto(
  UpdateBumdesProfileSchema,
) {}
