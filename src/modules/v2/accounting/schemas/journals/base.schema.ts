import { JournalCategory } from '@prisma/client';
import Decimal from 'decimal.js';
import { z } from 'nestjs-zod/z';
import { StringToBoolSchema } from '~common/schemas';

export const JournalTransactionV2Schema = z.object({
  account_id: z.coerce.number().nonnegative(),
  amount: z.coerce
    .number()
    .positive({ message: 'Nilai transaksi harus lebih dari 0' }),
  is_credit: StringToBoolSchema,
});

export const JournalV2Schema = z.object({
  unit_id: z.string(),
  description: z.string(),
  occurred_at: z.dateString().cast().or(z.coerce.date()),
  category: z.nativeEnum(JournalCategory),
  evidence: z.string().optional(),
  data_transactions: z
    .array(JournalTransactionV2Schema)
    .min(2, {
      message: 'Minimal 2 data transaksi',
    })
    .refine(
      (transactions) => {
        const accountIds = new Set<number>();

        transactions.forEach((transaction) => {
          accountIds.add(transaction.account_id);
        });

        return accountIds.size === transactions.length;
      },
      { message: 'Tidak boleh ada akun yang sama' },
    )
    .refine(
      (transactions) => {
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        transactions.forEach((transaction) => {
          if (transaction.is_credit) {
            totalCredit = totalCredit.plus(transaction.amount);
          } else {
            totalDebit = totalDebit.plus(transaction.amount);
          }
        });

        return totalDebit.equals(totalCredit);
      },
      {
        message: 'Total debit dan kredit harus sama',
      },
    ),
});

export type JournalV2Type = z.infer<typeof JournalV2Schema>;
export type JournalTransactionV2Type = z.infer<
  typeof JournalTransactionV2Schema
>;
