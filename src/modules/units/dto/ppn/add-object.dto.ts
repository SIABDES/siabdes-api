import {
  PpnTaxItemType,
  PpnTaxObject,
  PpnTransactionType,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import {
  StringNumberIntPositiveSchema,
  StringNumberNonNegativeSchema,
} from '~common/dto';

export const AddPpnObjectSchema = z.object({
  given_to: z.string(),
  item_type: z.enum([PpnTaxItemType.GOODS, PpnTaxItemType.SERVICE]),
  transaction_type: z.enum([
    PpnTransactionType.PURCHASE,
    PpnTransactionType.SALES,
  ]),
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
        quantity: StringNumberIntPositiveSchema,
        price: StringNumberNonNegativeSchema,
        discount: StringNumberNonNegativeSchema,
        total_price: StringNumberNonNegativeSchema,
        dpp: StringNumberNonNegativeSchema,
        ppn: StringNumberNonNegativeSchema,
      }),
    )
    .min(1),
});

export class AddPpnObjectDto extends createZodDto(AddPpnObjectSchema) {}
