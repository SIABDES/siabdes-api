import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetLedgerPayloadSchema = z.object({
  id: z.number(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

export class GetLedgerPayloadDto extends createZodDto(GetLedgerPayloadSchema) {}
