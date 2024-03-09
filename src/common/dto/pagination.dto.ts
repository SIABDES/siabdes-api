import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PaginationSchema = z.object({
  cursor: z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .or(z.number())
    .optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export class PaginationDto extends createZodDto(PaginationSchema.optional()) {}
