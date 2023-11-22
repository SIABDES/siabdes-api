import { createZodDto } from 'nestjs-zod';
import { GetJournalsFilterSchema } from '~modules/journals/dto';

export const GetLedgerFiltersSchema = GetJournalsFilterSchema;

export class GetLedgerFiltersDto extends createZodDto(
  GetLedgerFiltersSchema.optional(),
) {}
