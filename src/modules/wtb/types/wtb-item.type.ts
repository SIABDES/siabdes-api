import { z } from 'nestjs-zod/z';

export const WtbAccountItemDetailsSchema = z.object({
  debit: z.number(),
  credit: z.number(),
});

export const WtbAccountResultSchema = z.object({
  neraca_saldo: WtbAccountItemDetailsSchema.required(),
  penyesuaian: WtbAccountItemDetailsSchema.required(),
  neraca_setelahnya: WtbAccountItemDetailsSchema.required(),
  laba_rugi: WtbAccountItemDetailsSchema.required(),
  posisi_keuangan: WtbAccountItemDetailsSchema.required(),
});

export const WtbAccountItemSchema = z.object({
  account: z.object({
    id: z.number(),
    name: z.string(),
    ref: z.string(),
    is_credit: z.boolean(),
    is_posisi_keuangan: z.boolean(),
  }),
  result: WtbAccountResultSchema.required(),
});

export type WtbAccountItem = z.infer<typeof WtbAccountItemSchema>;
export type WtbAccountItemDetails = z.infer<typeof WtbAccountItemDetailsSchema>;
export type WtbAccountResult = z.infer<typeof WtbAccountResultSchema>;
