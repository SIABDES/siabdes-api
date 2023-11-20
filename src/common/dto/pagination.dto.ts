import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PaginationSchema = z
  .object({
    cursor: z.string().or(z.number()).optional(),
    limit: z.number().min(1).optional(),
  })
  .optional();

export class PaginationDto extends createZodDto(PaginationSchema) {}
