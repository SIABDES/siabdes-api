import { PpnTransactionType, PpnTaxObject } from '@prisma/client';
import { z } from 'nestjs-zod/z';

const PpnObjectItemSchema = z.object({
  name: z.string().min(1, 'Nama item tidak boleh kosong!'),
  quantity: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total_price: z.number().nonnegative(),
  dpp: z.number().nonnegative(),
  ppn: z.number().nonnegative(),
});

const MutationPpnV2Schema = z.object({
  transaction_date: z
    .dateString()
    .minYear(1900, 'Tanggal transaksi tidak valid!')
    .maxYear(new Date().getFullYear(), 'Tanggal transaksi tidak valid!'),
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
  object_items: z.array(PpnObjectItemSchema).min(1, {
    message: 'Item objek pajak tidak boleh kosong!',
  }),
});

export { MutationPpnV2Schema, PpnObjectItemSchema };
