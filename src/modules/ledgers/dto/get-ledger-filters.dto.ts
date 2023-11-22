import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { GetJournalsFilterSchema } from '~modules/journals/dto';

export const GetLedgerFiltersSchema = GetJournalsFilterSchema.extend({
  account_id: z
    .string({ required_error: 'Account ID is required' })
    .transform((val) => parseInt(val))
    .or(
      z
        .number({ required_error: 'Account ID is required' })
        .min(1, 'Account ID must be greater than 0'),
    ),
});

export class GetLedgerFiltersDto extends createZodDto(
  GetLedgerFiltersSchema.optional(),
) {}
