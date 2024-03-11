import { createZodDto } from 'nestjs-zod';
import { CommonDeleteSchema } from '~common/schemas';

export class CommonDeleteDto extends createZodDto(CommonDeleteSchema) {}

export class OptionalCommonDeleteDto extends createZodDto(
  CommonDeleteSchema.optional(),
) {}
