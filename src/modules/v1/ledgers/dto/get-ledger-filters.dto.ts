import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { GetJournalsFilterSchema } from '~modules/v1/journals/dto';

export const GetLedgerFiltersSchema = GetJournalsFilterSchema.extend({
  unit_id: z.string().optional(),
});

export class GetLedgerFiltersDto extends createZodDto(
  GetLedgerFiltersSchema.optional(),
) {}
