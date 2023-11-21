import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetLedgerFiltersSchema = z
  .object({
    get_deleted: z.boolean().optional().default(false),
  })
  .optional();

export class GetLedgerFiltersDto extends createZodDto(GetLedgerFiltersSchema) {}
