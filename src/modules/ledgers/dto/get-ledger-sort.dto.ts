import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import {
  GetJournalsSortDto,
  GetJournalsSortSchema,
} from '~modules/journals/dto';

export const GetLedgerSortSchema = GetJournalsSortSchema;

export class GetLedgerSortDto extends createZodDto(
  GetLedgerSortSchema.required(),
) {}
