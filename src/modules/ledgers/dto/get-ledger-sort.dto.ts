import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetLedgerSortSchema = z.object({}).optional();

export class GetLedgerSortDto extends createZodDto(GetLedgerSortSchema) {}
