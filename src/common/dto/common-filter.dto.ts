import { createZodDto } from 'nestjs-zod';
import { BumdesIdsSchema } from './bumdes.dto';
import { PaginationSchema } from './pagination.dto';

export const IdsWithPaginationSchema = BumdesIdsSchema.merge(PaginationSchema);

export class IdsWithPaginationDto extends createZodDto(
  IdsWithPaginationSchema.optional(),
) {}
