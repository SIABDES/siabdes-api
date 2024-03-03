import {
  PpnTransactionType,
  PpnTaxObject,
  PpnTaxItemType,
} from '@prisma/client';
import { z } from 'nestjs-zod/z';

const PpnObjectItemV2Schema = z.object({
  name: z.string().min(1, 'Nama item tidak boleh kosong!'),
  quantity: z.coerce.number().int().nonnegative(),
  price: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  total_price: z.coerce.number().nonnegative(),
  dpp: z.coerce.number().nonnegative(),
  ppn: z.coerce.number().nonnegative(),
});

const MutationPpnV2Schema = z.object({
  transaction_date: z
    .dateString()
    .minYear(1900, 'Tanggal transaksi tidak valid!')
    .maxYear(new Date().getFullYear(), 'Tanggal transaksi tidak valid!')
    .or(z.date()),
  transaction_number: z
    .string()
    .min(1, { message: 'Nomor transaksi tidak boleh kosong!' }),
  transaction_type: z.enum(
    [PpnTransactionType.PURCHASE, PpnTransactionType.SALES],
    {
      invalid_type_error: 'Jenis transaksi hanya bisa "PURCHASE" atau "SALES"',
      required_error: 'Jenis transaksi tidak boleh kosong',
    },
  ),
  given_to: z
    .string()
    .min(1, { message: 'Pengusaha kena pajak tidak boleh kosong!' }),
  tax_object: z.enum(
    [
      PpnTaxObject.NO_TAXES,
      PpnTaxObject.INTERNATIONAL_TAXES,
      PpnTaxObject.DOMESTIC_TAXES,
    ],
    {
      invalid_type_error:
        'Objek pajak hanya bisa "NO_TAXES", "INTERNATIONAL_TAXES", atau "DOMESTIC_TAXES"',
      required_error: 'Objek pajak tidak boleh kosong',
    },
  ),
  item_type: z.enum([PpnTaxItemType.GOODS, PpnTaxItemType.SERVICE], {
    invalid_type_error: 'Jenis item pajak hanya bisa "GOODS" atau "SERVICE"',
    required_error: 'Jenis item pajak tidak boleh kosong',
  }),
  object_items: z.array(PpnObjectItemV2Schema).min(1, {
    message: 'Item objek pajak tidak boleh kosong!',
  }),
});

type MutationPpnV2Type = z.infer<typeof MutationPpnV2Schema>;
type PpnObjectItemType = z.infer<typeof PpnObjectItemV2Schema>;

export {
  MutationPpnV2Schema,
  PpnObjectItemV2Schema,
  PpnObjectItemType,
  MutationPpnV2Type,
};
