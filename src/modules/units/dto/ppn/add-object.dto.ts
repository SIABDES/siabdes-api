import { PpnTaxItemType, PpnTaxObject } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import {
  StringNumberIntPositiveSchema,
  StringNumberNonNegativeSchema,
} from '~common/dto';

export const AddPpnObjecSchema = z.object({
  given_to: z.string(),
  transaction_date: z
    .dateString()
    .transform((val) => new Date(val))
    .pipe(z.date()),
  transaction_number: z.string(),
  tax_object: z.enum([
    PpnTaxObject.NO_TAXES,
    PpnTaxObject.DOMESTIC_TAXES,
    PpnTaxObject.INTERNATIONAL_TAXES,
  ]),
  object_items: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum([PpnTaxItemType.GOODS, PpnTaxItemType.SERVICE]),
        quantity: StringNumberIntPositiveSchema,
        price: StringNumberNonNegativeSchema,
        discount: StringNumberNonNegativeSchema,
        total_price: StringNumberNonNegativeSchema,
        dpp: StringNumberNonNegativeSchema,
        // tariff: StringNumberNonNegativeSchema,
        ppn: StringNumberNonNegativeSchema,
      }),
    )
    .min(1),
});

export class AddPpnObjectDto extends createZodDto(AddPpnObjecSchema) {}
