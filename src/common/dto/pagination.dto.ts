import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PaginationSchema = z
  .object({
    cursor: z.string().or(z.number()).optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val))
      .optional(),
  })
  .optional();

export class PaginationDto extends createZodDto(PaginationSchema) {}
