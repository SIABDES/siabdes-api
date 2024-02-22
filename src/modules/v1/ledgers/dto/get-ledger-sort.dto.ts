import { createZodDto } from 'nestjs-zod';
import { GetJournalsSortSchema } from '~modules/v1/journals/dto';

export const GetLedgerSortSchema = GetJournalsSortSchema;

export class GetLedgerSortDto extends createZodDto(
  GetLedgerSortSchema.required(),
) {}
