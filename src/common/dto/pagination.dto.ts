import { createZodDto } from 'nestjs-zod';
import { CommonPaginationSchema } from '~common/schemas';

export class PaginationDto extends createZodDto(CommonPaginationSchema) {}

export class OptionalPaginationDto extends createZodDto(
  CommonPaginationSchema.optional(),
) {}
