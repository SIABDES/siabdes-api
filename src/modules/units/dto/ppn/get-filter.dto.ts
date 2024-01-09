import { PpnTaxObject, PpnTransactionType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetPpnTaxesFilterSchema = z.object({
  is_detailed: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .pipe(z.boolean())
    .default('false')
    .optional(),
  transaction_number: z.string().optional(),
  transaction_date: z.dateString().optional(),
  given_to: z.string().optional(),
  transaction_type: z
    .enum([PpnTransactionType.PURCHASE, PpnTransactionType.SALES])
    .optional(),
  tax_object: z
    .enum([
      PpnTaxObject.NO_TAXES,
      PpnTaxObject.DOMESTIC_TAXES,
      PpnTaxObject.INTERNATIONAL_TAXES,
    ])
    .optional(),
});

export class GetPpnTaxesFilterDto extends createZodDto(
  GetPpnTaxesFilterSchema.optional(),
) {}
