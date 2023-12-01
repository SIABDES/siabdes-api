import { createZodDto } from 'nestjs-zod';
import { GetJournalsSortSchema } from '~modules/journals/dto';

export const GetLedgerSortSchema = GetJournalsSortSchema;

export class GetLedgerSortDto extends createZodDto(
  GetLedgerSortSchema.required(),
) {}
