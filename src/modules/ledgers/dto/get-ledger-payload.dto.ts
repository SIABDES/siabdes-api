import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetLedgerPayloadSchema = z.object({
  previous_balance: z
    .string()
    .transform((val) => parseFloat(val))
    .or(z.number().min(0))
    .default(0),
});

export class GetLedgerPayloadDto extends createZodDto(GetLedgerPayloadSchema) {}
