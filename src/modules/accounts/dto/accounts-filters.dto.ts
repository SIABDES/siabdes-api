import { BumdesUnitBusinessType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AccountsFiltersSchema = z
  .object({
    name: z.string().optional(),
    group_ref: z.string().optional(),
    ref: z.string().optional(),
    business_types: z
      .array(
        z.enum([
          BumdesUnitBusinessType.COMMERCE,
          BumdesUnitBusinessType.SERVICES,
          BumdesUnitBusinessType.INDUSTRY,
        ]),
      )
      .optional(),
  })
  .optional();

export class AccountsFiltersDto extends createZodDto(AccountsFiltersSchema) {}
