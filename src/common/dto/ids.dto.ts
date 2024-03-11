import { createZodDto } from 'nestjs-zod';
import { IdsSchema, IdsWithPaginationSchema } from '~common/schemas';

export class IdsDto extends createZodDto(IdsSchema) {}

export class OptionalIdsDto extends createZodDto(IdsSchema.optional()) {}

export class IdsWithPaginationDto extends createZodDto(
  IdsWithPaginationSchema,
) {}

export class OptionalIdsWithPaginationDto extends createZodDto(
  IdsWithPaginationSchema.optional(),
) {}
